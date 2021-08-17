<template>
  <form>
    <div class="row mt-5">
      <div class="col-sm-11 m-auto">
        <div class="card shadow">
          <header class="card-header">
            <strong class="align-self-center"> Conversor de Moedas </strong>
          </header>
          <div class="card-body">
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3">
                <div class="row">
                  <label> Campos com * são de preenchimento obrigatório </label>
                  <div class="col-3">
                    <label>* Valor </label>
                    <input
                      class="form-control"
                      type="text"
                      placeholder="Digite um valor"
                      required
                      maxlength="50"
                      step="any"
                      @keydown="validaCampos"
                      @keyup="validaCampos"
                      @keypress="validaCampos"
                      v-model="ViewModel.value"
                      v-money="money"
                    />
                  </div>
                  <div class="col-4">
                    <label>* Converter de</label>
                    <Multiselect
                      v-model="ViewModel.moedaOrigem"
                      placeholder="Selecione a moeda"
                      :options="optionsMoedas"
                      @select="preencherSeletorMoedaDestino()"
                    />
                  </div>
                  <div class="col-1">
                    <button
                      @click="alterarMoedas"
                      class="btn btn-primary mt-4 col-12"
                    >
                      <i class="fas fa-arrows-alt-h"></i>
                    </button>
                  </div>
                  <div class="col-4">
                    <label>* Para</label>
                    <Multiselect
                      v-model="ViewModel.moedaDestino"
                      :placeholder="placeholderDestino"
                      :options="optionsMoedasDestino"
                      @select="validaCampos()"
                    />
                  </div>
                </div>

                <div class="card mt-4">
                  <header class="card-header">
                    <strong class="align-self-center">
                      Resultado da conversão:
                    </strong>
                  </header>
                  <div class="card-body">
                    <div class="row">
                      <div
                        class="card-body col-sm-12 col-md-6 col-lg-6 col-xl-6"
                      >
                        <div class="card card-body">
                          <label>
                            <b>Conversão de: </b>
                            {{ coinOrigin }}
                          </label>
                          <label>
                            <b>Valor a converter:</b> {{ ViewModel.value }}
                          </label>
                        </div>
                      </div>
                      <div
                        class="card-body col-sm-12 col-md-6 col-lg-6 col-xl-6"
                      >
                        <div class="card card-body">
                          <label>
                            <b>Para: </b>
                            {{ coinDestiny }}
                          </label>
                          <label>
                            <b>Resultado da conversão: </b>
                            <label> {{ converted_value }} </label>
                          </label>
                        </div>
                      </div>

                      <div class="card-body">
                        <label
                          ><b>IOF(1,1%)</b> = {{ iof_value }} {{ coinOrigin }}
                        </label>
                        <br />
                        <label
                          ><b>Taxa admistrativa</b> = {{ fx_value }}
                          {{ coinOrigin }}</label
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-3 ml-2">
                  <button class="btn btn-warning ml-2" @click="limpaForm">
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import Multiselect from "@vueform/multiselect";

export default {
  name: "Home",
  components: { Multiselect },
  setup() {
    let ViewModel = ref({
      value: ref(),
      moedaOrigem: ref(),
      moedaDestino: ref(),
    });
    let optionsMoedas = [
      {
        value: 0,
        label: "EUR - Euro",
      },
      {
        value: 1,
        label: "BRL - Real Brasileiro",
      },
      {
        value: 2,
        label: "USD - Dolar Ameicano",
      },
    ];
    let optionsMoedasDestino = ref([]);
    
    let coinOrigin = ref();
    let coinDestiny = ref();

    let converted_value = ref(); //resultado
    let iof_value = ref();
    let fx_value = ref();
    let fx_rate = ref(); //taxa de câmbio

    let placeholderDestino = ref("Selecione uma moeda de origem");

    const limpaForm = (e) => {
      e.preventDefault();
      ViewModel.value.value = ref();
      ViewModel.value.moedaOrigem = ref();
      ViewModel.value.moedaDestino = ref();
      optionsMoedasDestino.value = ref([]);
      coinOrigin.value = "";
      coinDestiny.value = "";
      converted_value.value = "";
      iof_value.value = "";
      fx_value.value = "";
    };
    const preencherSeletorMoedaDestino = () => {
      ViewModel.value.moedaDestino = ref();
      optionsMoedasDestino.value = ref([]);
      let moedasDestino = [];
      if (ViewModel.value.moedaOrigem >= 0) {
        optionsMoedas.forEach((index) => {
          if (ViewModel.value.moedaOrigem != index.value) {
            moedasDestino.push(index);
          }
          optionsMoedasDestino.value = moedasDestino;
        });
        placeholderDestino.value = "Selecione a moeda";
      }
    };

    const validaCampos = () => {
      if (
        ViewModel.value.value &&
        ViewModel.value.moedaOrigem >= 0 &&
        ViewModel.value.moedaDestino >= 0
      ) {
        calcularCotacao();
      }
    };
    const calcularCotacao = () => {
      let fx_rate; //tacha de cambio
      let value = ViewModel.value.value.replaceAll("R$", "");
      value = value.replaceAll(",", "");
      value = value.replaceAll(".", "");
      value = value.substr(0, value.length - 2);
      value = Number(value);
      iof_value.value = (value * 1.1) / 100; //IOF: 1.1%
      fx_value.value = value / 100; // FX: 1.0%
      let result;
      if (
        ViewModel.value.moedaOrigem == 2 &&
        ViewModel.value.moedaDestino == 1
      ) {
        fx_rate = 5.2164; //USD -> BRL: 5.2164
        result = (value - iof_value.value - fx_value.value) * fx_rate;
      } else if (
        ViewModel.value.moedaOrigem == 0 &&
        ViewModel.value.moedaDestino == 1
      ) {
        fx_rate = 6.397; //EUR -> BRL: 6.3970
      } else if (
        ViewModel.value.moedaOrigem == 0 &&
        ViewModel.value.moedaDestino == 2
      ) {
        fx_rate = 1.2206; //EUR -> USD: 1.2206
      } else if (
        ViewModel.value.moedaOrigem == 1 &&
        ViewModel.value.moedaDestino == 2
      ) {
        fx_rate = 1.0 / 5.2164; //BRL -> USD: 0.1917
      } else if (
        ViewModel.value.moedaOrigem == 1 &&
        ViewModel.value.moedaDestino == 0
      ) {
        fx_rate = 1.0 / 6.397; //BRL -> USD: 0.1563
      } else if (
        ViewModel.value.moedaOrigem == 2 &&
        ViewModel.value.moedaDestino == 0
      ) {
        fx_rate = 5.2164 / 6.397;
      } else {
        //small fire
        alert("Campos com * são de preenchimento obrigatório");
      }
      result = (value - iof_value.value - fx_value.value) * fx_rate;
      converted_value.value = formataValores(result);
      iof_value.value = formataValores(iof_value.value);
      fx_value.value = formataValores(fx_value.value);
      pegaLabelMoedas();
    };
    const pegaLabelMoedas = () => {
      function filtroLabelMoedas(index) {
        if (index.value == ViewModel.value.moedaOrigem) {
          coinOrigin.value = index.label;
        }
        if (index.value == ViewModel.value.moedaDestino) {
          coinDestiny.value = index.label;
        }
      }
      optionsMoedas.forEach(filtroLabelMoedas);
    };
    const alterarMoedas = (e) => {
      e.preventDefault();
      let moedaOrigemSelecionada = ViewModel.value.moedaOrigem;
      let moedaDestinoSelecionada = ViewModel.value.moedaDestino;
      ViewModel.value.moedaOrigem = moedaDestinoSelecionada;
      preencherSeletorMoedaDestino();
      ViewModel.value.moedaDestino = moedaOrigemSelecionada;
      validaCampos();
    };

    const formataValores = (value) => {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    return {
      ViewModel,
      fx_rate,
      optionsMoedas,
      calcularCotacao,
      placeholderDestino,
      limpaForm,
      converted_value,
      pegaLabelMoedas,
      coinOrigin,
      coinDestiny,
      iof_value,
      fx_value,
      optionsMoedasDestino,
      preencherSeletorMoedaDestino,
      alterarMoedas,
      validaCampos,
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
        formataValores,
      },
    };
  },
};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
