<template>
  <q-item-section>
    <div class="row q-col-gutter-sm justify-around margin">
      <div v-for="(item, index) in items" :key="index" class="col-xs-4 col-sm-2 col-md-2 col-lg-2 col-xl-2">
        <q-item flat :label="item.label" clickable :to="item.to" class="shadow-item box-item" :style="{ backgroundColor: item.color }">
          <q-item-section class="q-column items-center text-center">
            <div class="row items-center justify-center">
              <div class="large-text">{{ item.num }}</div>
              <q-icon :name="item.icon" class="medium-icon left-margem" />
            </div>
            <div class="texto text-h7">{{ item.label }}</div>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-item-section>
</template>

<script setup lang="ts">

// Recebe as props do componente pai
defineProps<{
  items: Array<{ label: string; num: number; icon: string; color: string; to: string }>;
}>();
</script>

<style scoped lang="scss">
@import "src/css/app.scss";

.large-text {
  font-size: 18px;
  font-weight: bold;

  @media (min-width: 1024px) {
    font-size: 24px;
  }
}

.box-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 5px;
  min-width: 80px;
  max-width: 140px;
  min-height: 80px;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  @media (min-width: 1024px) {
    padding: 16px;
    min-width: 120px;
    max-width: 180px;
    min-height: 120px;
    border-radius: 16px;
  }
}

.margin {
  margin: 10px;

  @media (min-width: 1024px) {
    margin: 0;
    display: flex;
    gap: 20px;
    justify-content: center;
    width: 100%;
  }
}

.texto {
  font-size: 18px;

  @media (min-width: 1024px) {
    font-size: 16px;
    font-weight: 600;
  }
}

.q-item-section {
  @media (min-width: 1024px) {
    padding: 0;
  }
}

.medium-icon {
  @media (min-width: 1024px) {
    font-size: 28px !important;
  }
}
</style>
