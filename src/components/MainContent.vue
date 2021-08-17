<template>
  <div>    
    <Suspense>
      <template #default>
        <router-view />
      </template>
      <template #fallback> Carregando pagina... </template>
    </Suspense>
  </div>
</template>