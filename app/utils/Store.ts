import config from "~/store/config";

class Store {
  get config() {
    return config();
  }
}

const store = new Store();
export default store;
