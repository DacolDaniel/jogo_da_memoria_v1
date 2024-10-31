const PATH_IMG = './imagem/';
Vue.component('card', {
    props: ['nome', 'imagem', 'index'],
    template: `
      <div class="card" @click="acao">
        <img :src="imagem">
        <div class="card-title">
           {{nome}}
        </div>
      </div>
    `,
    methods: {
        acao: function (index) {
            this.$emit('acao', {index})
        }
    }
});

app = new Vue({
    el: "#app",
    data: function () {        
        return {
            cardOculto: PATH_IMG + 'interrogacao.png',
            cardsGame: [
                {nome: "Igor, Hugo, Cláudia e Carlos", imagem: `${PATH_IMG}carlos.jpg`, encontrado: false, mostrar: true},
                {nome: "Célia e Joaquim", imagem: `${PATH_IMG}celia1.jpg`, encontrado: false, mostrar: true},                
                {nome: "Iraci, Célia e Théo", imagem: `${PATH_IMG}iraci_theo.jpg`, encontrado: false, mostrar: true},
                {nome: "Iraci", imagem: `${PATH_IMG}iraci.jpg`, encontrado: false, mostrar: true},
                {nome: "Luciano, Célia, Iraci, Neuza, Jurandir, Moacir", imagem: `${PATH_IMG}irmaos1.jpg`, encontrado: false, mostrar: true},                
                {nome: "Iraci, Orácio, Célia, Luciano", imagem: `${PATH_IMG}irmaos2.jpg`, encontrado: false, mostrar: true},   
                {nome: "Luciana e Manuela", imagem: `${PATH_IMG}luciana.jpg`, encontrado: false, mostrar: true},                
                {nome: "Marcilio Dacol", imagem: `${PATH_IMG}marcilio.jpg`, encontrado: false, mostrar: true},
                {nome: "Luciano, Daniel e Luisa", imagem: `${PATH_IMG}luciano_luisa.jpg`, encontrado: false, mostrar: true},
                {nome: "Marcilio Dacol", imagem: `${PATH_IMG}marcilio2.jpg`, encontrado: false, mostrar: true},                               
                {nome: "Aline e Neuza", imagem: `${PATH_IMG}neuza.jpg`, encontrado: false, mostrar: true},
                {nome: "Luciano e Orácio", imagem: `${PATH_IMG}oracio.jpg`, encontrado: false, mostrar: true},
                {nome: "Jurandir e Luisa", imagem: `${PATH_IMG}pai_luisa.jpg`, encontrado: false, mostrar: true}, 
                {nome: "Sandra, Toninho", imagem: `${PATH_IMG}sandra.jpg`, encontrado: false, mostrar: true}, 
                {nome: "Tereza Dacol", imagem: `${PATH_IMG}tereza.jpg`, encontrado: false, mostrar: true}, 
                {nome: "Daniel, Moacir e Nádia", imagem: `${PATH_IMG}tioci.jpg`, encontrado: false, mostrar: true},    
                {nome: "Neide e Théo", imagem: `${PATH_IMG}neide_theo.jpg`, encontrado: false, mostrar: true}, 
                {nome: "Neide, Moacir e Neuza", imagem: `${PATH_IMG}neide1.jpg`, encontrado: false, mostrar: true},                             
            ],
            cards: [],
            option: 'menu',
            menuGameShow: false,
            contagemShow: false,
            contagemValue: 1,
            tempoObj:{hora:0,minuto:0,segundo:0},
            contarTempoInterval: null,
            resultado:{erro:0,tempo:'00:00:00'},
            temporizador:null,
            records:[],
            som: new Audio('./audio/Hypnotic-Puzzle4.mp3'),
            somErro: new Audio('./audio/UI_Quirky25.mp3'),
            somAcerto:new Audio('./audio/Coins14.mp3'),
            volume:50,
            mostrarVolume:false
        }
    },
    methods: {
        start: function () {
            console.log("Método start chamado");
            this.cards = []; // Reinicia o array de cards
            this.embaralharCards(); // Chama o método para embaralhar os cards
            this.iniciarContagem(); // Inicia a contagem
            setTimeout(this.esconderCards, 3000); // Esconde os cards após 3 segundos
        },
        embaralharCards: function () {
            // Adiciona duas instâncias de cada card ao array
            this.cardsGame.forEach(card => {
                this.cards.push(Object.assign({}, card)); // Adiciona a primeira instância
                this.cards.push(Object.assign({}, card)); // Adiciona a segunda instância
            });
    
            // Embaralha o array de cards
            this.cards = this.cards.sort(() => Math.random() - 0.5);
        },  
        
        contarCardGamenosCards: function (card) {

            let cards = this.cards.filter(value => {
                return value.nome == card.nome
            });

            return cards.length;
        },
        getRandom: function (max) {
            return Math.floor(Math.random() * max)
        },
        mostrarCard: function (index) {
            if(this.cards[index].encontrado || this.cards[index].mostrar ){
                return;
            }
            this.cards[index].mostrar = true;
            let cardsAbertos = this.procurarCardAberto();
            if (cardsAbertos.length == 2) {

                setTimeout(function () {
                    cardsAbertos[0].mostrar = false;
                    cardsAbertos[1].mostrar = false;
                }, 1000);

                if (cardsAbertos[0].nome == cardsAbertos[1].nome) {
                    this.somAcerto.play();
                    cardsAbertos[0].encontrado = true;
                    cardsAbertos[1].encontrado = true;
                    return;
                }

                this.resultado.erro++;
                this.somErro.play();

            }
        },
        procurarCardAberto: function () {
            let cardsAbertos = this.cards.filter(value => {
                return value.mostrar == true;
            });

            return cardsAbertos
        },
        esconderCards: function () {
            for (let i = 0; i < this.cards.length; i++) {
                this.cards[i].mostrar = false;
            }
        },
        menuOption: function (op) {
            this.option = op;
            clearInterval(this.temporizador);
            this.records = localStorage.getItem('records') ? JSON.parse(localStorage.getItem('records')) : [];
            this.menuGameShow = false;
            console.log(this.som.readyState);
            if(typeof this.som == "object"){
                this.som.volume = this.volume/100;
                this.som.loop=true;
                this.som.play();
            }
            switch (this.option) {
                case "game":
                    this.tempoObj.hora = 0;
                    this.tempoObj.minuto = 0;
                    this.tempoObj.segundo = 0;
                    this.resultado.tempo = '00:00:00';
                    this.resultado.erro = 0;
                    new Audio('./audio/Robot-Footstep_4.mp3').play();
                    this.start();
                    break;
                case "records":
                     this.option = "records";
                     this.records.sort(function(a,b){
                           let dateA = new Date('01/01/2000 '+a.tempo);
                           let dateB  = new Date('01/01/2000 '+b.tempo);
                           if(dateA < dateB && a.erro < b.erro){
                               return -1;
                           }

                         if(dateA > dateB && a.erro > b.erro ){

                             return 1
                         }


                         return 0;
                     });
                    break;
                default:
                    this.option = "menu";
                    break;
            }
        },
        toogleMenuGame: function () {
            this.menuGameShow = !this.menuGameShow;
        },
        toogleVolume: function () {
            this.mostrarVolume = !this.mostrarVolume;
        },
        iniciarContagem: function () {
            this.contagemShow = true;
            var contagem = setInterval(incrementar, 1000);
            var me = this;

            function incrementar() {
                if (me.contagemValue == 4) {
                    clearInterval(contagem);
                    setTimeout(() => {
                        me.contagemValue = 1;
                        me.contagemShow = false;
                        me.timeGame();
                    }, 1000);
                }
                me.contagemValue++;
            }

        },
        cardsEncontrados:function(){
            let cardsEncontrados = this.cards.filter(value => {
                return value.encontrado == true;
            });

            return cardsEncontrados
        },
        timeGame: function(){
            this.temporizador = setInterval(incrementar, 1000);
            var me = this;
            function incrementar() {
                let cardsEncontrados = me.cardsEncontrados();
                if(cardsEncontrados.length == me.cards.length){
                    new Audio('./audio/Creepy_Percussion_6.mp3').play();
                    clearInterval(me.temporizador);
                    me.records.push(me.resultado);
                    localStorage.setItem('records',JSON.stringify(me.records));
                    return;
                }
                if(me.tempoObj.segundo < 60){
                     me.tempoObj.segundo++;
                }else if(me.tempoObj.segundo > 59 && me.tempoObj.minuto < 60){
                    me.tempoObj.segundo = 0;
                    me.tempoObj.minuto++
                }else{
                    me.tempoObj.segundo = 0;
                    me.tempoObj.minuto = 0;
                    me.tempoObj.hora++;
                }
                me.resultado.tempo = `${me.tempoObj.hora.toString().padStart(2, '0')}:${me.tempoObj.minuto.toString().padStart(2, '0')}:${me.tempoObj.segundo.toString().padStart(2, '0')}`;
            }


    },
        modificarVolume:function(){
            this.som.volume = this.volume/100;
        }
    }
});
