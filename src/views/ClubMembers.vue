<template>
  <div class="p-4 bg-gray-900 min-h-screen">
    <!-- Toggle Buttons -->
    <div class="flex justify-end mb-4">
      <button
          :class="[view === 'members' ? activeClass : inactiveClass, 'rounded-l']"
          @click="view = 'members'"
      >
        Members
      </button>
      <button
          :class="[view === 'orgchart' ? activeClass : inactiveClass, 'rounded-r']"
          @click="view = 'orgchart'"
      >
        Org Chart
      </button>
      <!--      <button-->
      <!--          :class="[view === 'selectionOrder' ? activeClass : inactiveClass, 'rounded-r']"-->
      <!--          @click="view = 'selectionOrder'"-->
      <!--      >-->
      <!--        SelectionOrder-->
      <!--      </button>-->
    </div>

    <!-- Members View -->
    <div v-if="view === 'members'">
      <div v-if="error" class="text-center text-red-500 mb-4">
        Error: {{ error }}
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <!-- Skeleton loaders shown until data is loaded -->
        <template v-if="loading">
          <div
              v-for="n in skeletonCount"
              :key="n"
              class="bg-gray-800 shadow-md rounded-lg overflow-hidden animate-pulse"
          >
            <div class="bg-gray-700 h-48 w-full"></div>
            <div class="p-4 text-center">
              <div class="h-6 bg-gray-700 rounded w-3/4 mb-2 mx-auto"></div>
              <div class="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div class="h-4 bg-gray-700 rounded w-1/3 mt-2 mx-auto"></div>
            </div>
          </div>
        </template>
        <!-- Render member cards when data is loaded -->
        <template v-else>
          <div
              v-for="user in members"
              :key="user.id"
              class="bg-gray-800 shadow-md rounded-lg overflow-hidden"
          >
            <!-- Container ensures the image is square and centered -->
            <div class="w-full md:width-48 aspect-square">
              <img v-if="user.headshot_url"
                   :src="user.headshot_url"
                   alt="Headshot"
                   class="p-6 w-full h-full"
                   loading="lazy"
              />
            </div>
            <div class="p-4 text-center">
              <h2 class="text-xl font-bold text-white">{{ user.display_name }}</h2>
              <p v-if="user.club_title" class="text-gray-400">{{ user.club_title }}</p>
              <a
                  v-if="user.letterboxd_name"
                  :href="user.letterboxd_name"
                  target="_blank"
                  class="text-blue-400 hover:underline mt-2 block"
              >
                Letterboxd Profile
              </a>
            </div>
          </div>
        </template>
      </div>
    </div>


    <!-- Org Chart View -->
    <div
        v-else-if="view === 'orgchart'"
        class="flex justify-center items-center min-h-[300px] relative"
    >
      <img
          src="https://vuuwxeernvorwhkogrih.supabase.co/storage/v1/object/sign/assets/movieclub_orgchart.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80NThiNmI0NS02YjIxLTQ1YWMtYjVkNi1jYzU2NjE0MDZlMTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvbW92aWVjbHViX29yZ2NoYXJ0LnBuZyIsImlhdCI6MTc1NTQ1NTU5MCwiZXhwIjoyMDcwODE1NTkwfQ.Rv4CwyHe6IDklWsI6rRqfvAWKpj74bCEmpwfxXU9MdY"
          alt="Organization Chart"
          class="max-w-full h-auto transition-opacity duration-500"
          loading="lazy"
          @load="orgChartLoaded = true"
          :class="{'opacity-0': !orgChartLoaded, 'opacity-100': orgChartLoaded}"
      />
      <div
          v-if="!orgChartLoaded"
          class="absolute inset-0 flex justify-center items-center"
      >
        <div class="w-full h-[300px] bg-gray-700 animate-pulse rounded"></div>
      </div>
    </div>

    <!-- Selection Order View-->
    <div v-else-if="view === 'selectionOrder'">
      <SelectionOrder/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {supabase} from "@/database/supabaseClient"
import type {Tables} from "@/database/supabaseTypes.ts"
import SelectionOrder from "@/components/selection/SelectionOrder.vue";

type User = Tables<"users">

// Reactive state variables
const members = ref<User[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const view = ref<'members' | 'orgchart'>('members');
// const view = ref<'members' | 'orgchart' | 'selectionOrder'>('members'); // TODO: Add Selection Order tab

// Toggle button styles for dark theme
const activeClass = 'px-4 py-2 bg-black/50 text-white focus:outline-none';
const inactiveClass =
    'px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 focus:outline-none';

// Number of skeleton cards to display while loading member data
const skeletonCount = 6;

// Track if the org chart image has loaded
const orgChartLoaded = ref<boolean>(false);

// Function to fetch users from the Supabase table
const fetchMembers = async () => {
  loading.value = true;
  const {data, error: fetchError} = await supabase
      .from('users')
      .select('*')
      .eq('active', true)
      .order('ordering', {
        ascending: true
      });
  if (fetchError) {
    error.value = fetchError.message;
  } else if (data) {
    members.value = data as User[];
  }
  loading.value = false;
}

onMounted(() => {
  fetchMembers()
})
</script>