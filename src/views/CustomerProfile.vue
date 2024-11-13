<template>
  <div class="profile-container">
    <h2>Информация о пользователе</h2>

    <!-- Данные профиля -->
    <div class="profile-info">
      <div class="profile-fields">
        <input
          type="text"
          v-model="userProfile.name"
          @input="trackChanges"
          placeholder="Имя"
          class="profile-input"
        />
        <input
          type="email"
          v-model="userProfile.email"
          @input="trackChanges"
          placeholder="Email"
          class="profile-input"
        />
      </div>

      <!-- Кнопки действий -->
      <div class="action-buttons">
        <button
          @click="saveChanges"
          :disabled="!isSaveEnabled"
          class="save-changes-btn"
        >
          Сохранить изменения
        </button>
        <button
          @click="addNewAddress"
          :disabled="isAddressAddingDisabled"
          class="add-address-btn"
        >
          Добавить новый адрес
        </button>
      </div>
    </div>

    <h3>Адреса доставки</h3>

    <!-- Список адресов в виде карточек -->
    <div class="addresses-grid">
      <div
        v-for="(address, index) in userProfile.addresses"
        :key="address.id || index"
        :class="[
          'address-card',
          {'primary-address': address.id === primaryAddressId},
        ]"
      >
        <button class="delete-btn" @click="removeAddress(address, index)">
          &times;
        </button>

        <div class="address-header">
          <input
            type="radio"
            :name="'primary-address'"
            :value="address.id"
            v-model="primaryAddressId"
            @change="trackChanges"
            class="radio-button"
          />
          <label>{{
            address.id === primaryAddressId ? 'Основной' : 'Дополнительный'
          }}</label>
        </div>

        <div class="address-fields">
          <input
            type="text"
            v-model="address.country"
            @input="trackChanges"
            placeholder="Страна"
          />
          <div class="postal-city">
            <input
              type="text"
              v-model="address.postal_code"
              @input="trackChanges"
              placeholder="Почтовый индекс"
            />
            <input
              type="text"
              v-model="address.city"
              @input="trackChanges"
              placeholder="Город"
            />
          </div>
          <input
            type="text"
            v-model="address.street"
            @input="trackChanges"
            placeholder="Улица"
          />
          <input
            type="text"
            v-model="address.house"
            @input="trackChanges"
            placeholder="Дом"
          />
          <input
            type="text"
            v-model="address.apartment"
            @input="trackChanges"
            placeholder="Квартира"
          />
        </div>
      </div>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import apiClient from '../api'

export default {
  name: 'CustomerProfile',
  data() {
    return {
      userProfile: {
        name: '',
        email: '',
        addresses: [],
      },
      primaryAddressId: null,
      errorMessage: '',
      successMessage: '',
      isSaveEnabled: false,
      isAddressAddingDisabled: false,
    }
  },
  created() {
    this.fetchUserProfile()
  },
  methods: {
    async fetchUserProfile() {
      try {
        const {data} = await apiClient.get('/customer/profile')
        this.userProfile = data.data

        const primaryAddress = this.userProfile.addresses.find(
          (address) => address.is_primary
        )
        if (primaryAddress) {
          this.primaryAddressId = primaryAddress.id
        }
      } catch (error) {
        this.errorMessage = 'Не удалось загрузить данные профиля.'
        console.error('Ошибка при загрузке профиля:', error)
      }
    },
    trackChanges() {
      this.isSaveEnabled = true
      this.isAddressAddingDisabled = true
    },
    addNewAddress() {
      this.userProfile.addresses.push({
        country: '',
        city: '',
        street: '',
        house: '',
        apartment: '',
        postal_code: '',
        is_primary: false,
      })
      this.trackChanges()
    },
    removeAddress(address, index) {
      if (!address.id) {
        this.userProfile.addresses.splice(index, 1)
        this.isAddressAddingDisabled = false
      } else {
        apiClient
          .delete(`/customer/address/${address.id}`)
          .then(() => {
            this.fetchUserProfile()
          })
          .catch((error) => {
            this.errorMessage = 'Не удалось удалить адрес.'
            console.error('Ошибка при удалении адреса:', error)
          })
      }
    },
    async saveChanges() {
      this.userProfile.addresses = this.userProfile.addresses.map(
        (address) => ({
          ...address,
          is_primary: address.id === this.primaryAddressId,
        })
      )

      try {
        await apiClient.put('/customer/profile', this.userProfile)
        this.successMessage = 'Профиль успешно обновлен.'
        this.isSaveEnabled = false
        this.isAddressAddingDisabled = false
      } catch (error) {
        this.errorMessage = 'Не удалось сохранить изменения.'
        console.error('Ошибка при сохранении профиля:', error)
      }
    },
  },
}
</script>

<style scoped>
.profile-container {
  max-width: calc(100% - 462px);
  margin: 0 auto;
}

.profile-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.profile-input {
  width: 62%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 50px;
}

.save-changes-btn,
.add-address-btn {
  width: 100%;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.save-changes-btn {
  background-color: #28a745;
  color: white;
}

.add-address-btn {
  background-color: #007bff;
  color: white;
}

.save-changes-btn:disabled {
  background-color: #c3e6cb;
  cursor: not-allowed;
}

.add-address-btn:disabled {
  background-color: #b0c4de;
  cursor: not-allowed;
}

.save-changes-btn:hover:not(:disabled),
.add-address-btn:hover:not(:disabled) {
  opacity: 0.9;
}

/* Карточки адресов */
.addresses-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.address-card {
  width: calc(46% - 10px);
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Основной адрес — черный текст */
.primary-address {
  color: black;
}

/* Дополнительный адрес — серый текст */
.address-card:not(.primary-address) {
  color: #777;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 1.5em;
  color: #888;
  cursor: pointer;
}

.delete-btn:hover {
  color: #555;
}

.radio-button {
  margin-right: 10px;
  margin-bottom: 20px;
}

.address-fields input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.postal-city {
  display: flex;
  gap: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>
