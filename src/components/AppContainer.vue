<template>
  <Suspense>
    <template #default>
      <div class="wrapper">
        <div class="main">
          <Header></Header>          
          <main>
            <MainContent></MainContent>
          </main>
        </div>       
      </div>
    </template>
    <template #fallback> Aguarde.... </template>
  </Suspense>
</template>

<script>
import Header from "../components/base/header.vue"
import MainContent from "./MainContent";
export default {
  components: {
    MainContent,
    Header
  },
};
</script>