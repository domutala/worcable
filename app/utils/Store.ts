import config from "~/store/config";
import session from "~/store/session";

class Store {
  get config() {
    return config();
  }

  get session() {
    return session();
  }
}

const store = new Store();
export default store;
