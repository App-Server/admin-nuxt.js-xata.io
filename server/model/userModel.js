export default class User {
    constructor({ id = null, name = '', email = '', password = '' }) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
    }
}
  