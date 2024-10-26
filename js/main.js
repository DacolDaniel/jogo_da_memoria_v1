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
                {nome: "Daniel", imagem: `${PATH_IMG}daniel.jpeg`, encontrado: false, mostrar: true},
                {nome: "Nádia", imagem: `${PATH_IMG}nadia.jpeg`, encontrado: false, mostrar: true},
                {nome: "Theo", imagem: `${PATH_IMG}theo.jpeg`, encontrado: false, mostrar: true},
                {nome: "Zaion", imagem: `${PATH_IMG}zaion.jpeg`, encontrado: false, mostrar: true},
                {nome: "Luisa", imagem: `${PATH_IMG}luisa.jpeg`, encontrado: false, mostrar: true},
                {nome: "Jurandir", imagem: `${PATH_IMG}jurandir.jpeg`, encontrado: false, mostrar: true},
                {nome: "Familia", imagem: `${PATH_IMG}familia.jpeg`, encontrado: false, mostrar: true},
                {nome: "z.theo", imagem: `${PATH_IMG}z_theo.jpeg`, encontrado: false, mostrar: true},
                {nome: "Rosana", imagem: `${PATH_IMG}rosana.jpeg`, encontrado: false, mostrar: true}                
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
            this.cards = [];
            this.embaralharCards();
            this.iniciarContagem();
            setTimeout(this.esconderCards, 3000);
        },
        embaralharCards: function () {
            if (this.cards.length == (this.cardsGame.length * 2)) {
                return;
            }

            let index = this.getRandom(this.cardsGame.length);
            let count = this.contarCardGamenosCards(this.cardsGame[index]);
            if (count < 2) {
                this.cards.push(Object.assign({}, this.cardsGame[index]));
            }

            this.embaralharCards();


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
