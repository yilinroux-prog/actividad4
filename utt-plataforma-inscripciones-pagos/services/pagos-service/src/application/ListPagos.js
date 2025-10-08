class ListPagos {
  constructor({ dao }) { this.dao = dao; }
  async execute({ matricula }) {
    return this.dao.listByMatricula(matricula);
  }
}
module.exports = ListPagos;
