/**
 * DAO con inyección de "db" (para tests podemos mockearla).
 * Si más tarde quieres Postgres real, aquí enchufas pg/knex.
 */
class PaymentDAO {
  constructor(db) {
    this.db = db || { // DB en memoria para la demo/test
      pagos: new Map(),
      nextId: 1,
    };
  }

  async create(pago) {
    const id = this.db.nextId++;
    const toSave = { ...pago, id, status: pago.status || "CREATED" };
    this.db.pagos.set(id, toSave);
    return toSave;
  }

  async findById(id) {
    return this.db.pagos.get(Number(id)) || null;
  }

  async listByMatricula(matricula) {
    return Array.from(this.db.pagos.values()).filter(p => p.matricula === matricula);
  }

  async updateStatus(id, status) {
    const p = await this.findById(id);
    if (!p) return null;
    p.status = status;
    this.db.pagos.set(Number(id), p);
    return p;
  }
}
module.exports = PaymentDAO;
