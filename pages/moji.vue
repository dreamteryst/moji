<template>
  <v-card>
    <v-card-title>
      <v-btn depressed color="primary" @click="addItem">
        + New
      </v-btn>
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
    >
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <MojiForm ref="MojiForm" @add="submitAdd" @edit="submitEdit" />
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.type"
    >
      {{ snackbar.text }}
      <v-btn
        color="blue"
        text
        @click="snackbar.show = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-dialog
      v-model="confirm"
      max-width="350"
    >
      <v-card>
        <v-card-title class="headline">
          ยืนยันการลบ?
        </v-card-title>

        <v-card-text>
          เมื่อยืนยันคุณจะไม่สามารถกู้คืนข้อมูลนี้ได้
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            @click="confirm = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="submitDelete"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import MojiForm from '~/components/forms/MojiForm'

export default {
  components: { MojiForm },
  data () {
    return {
      search: '',
      snackbar: {
        show: false,
        text: '',
        type: ''
      },
      currentPK: null,
      confirm: false,
      headers: [
        { text: 'ชื่อขนม', value: 'name' },
        { text: 'ชื่อร้าน', value: 'store' },
        { text: 'ราคา (บาท)', value: 'price' },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      desserts: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.desserts = await this.$axios.$get('/api/moji')
    },
    addItem () {
      this.$refs.MojiForm.open('add')
    },
    editItem (item) {
      this.currentPK = item.id
      this.$refs.MojiForm.open('edit', item)
    },
    deleteItem (item) {
      this.currentPK = item.id
      this.confirm = true
    },
    async submitAdd (data) {
      try {
        const result = await this.$axios.$post('/api/moji', data)
        if (result) {
          this.snackbar = {
            show: true,
            text: 'Success',
            type: 'success'
          }
          this.$refs.MojiForm.close()
          this.fetchData()
        }
      } catch (e) {
        this.snackbar = {
          show: true,
          text: 'Fail',
          type: 'error'
        }
      }
    },
    async submitEdit (data) {
      try {
        const result = await this.$axios.$put(`/api/moji/${this.currentPK}`, data)
        if (result) {
          this.snackbar = {
            show: true,
            text: 'Success',
            type: 'success'
          }
          this.$refs.MojiForm.close()
          this.fetchData()
        }
      } catch (e) {
        this.snackbar = {
          show: true,
          text: 'Fail',
          type: 'error'
        }
      }
    },
    async submitDelete () {
      this.confirm = false
      try {
        await this.$axios.$delete(`/api/moji/${this.currentPK}`)
        this.snackbar = {
          show: true,
          text: 'Success',
          type: 'success'
        }
        this.fetchData()
      } catch (e) {
        this.snackbar = {
          show: true,
          text: 'Fail',
          type: 'error'
        }
      }
    }
  }
}
</script>
