const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class MusicsServices {
  constructor() {
    this._pool = new Pool();
  }

  async addMusic({ title, year, performer, genre, duration }) {
    const id = `song-${nanoid(16)}`;
    const inserteddAt = new Date().toISOString();
    const updatedAt = inserteddAt;
    
    const query = {
      text: 'INSERT INTO musics VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, inserteddAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Failed to add music');

    return result.rows[0].id;
  }

  async getMusics() {
    const result = await this._pool.query('SELECT id, title, performer FROM musics');
    return result.rows.map(mapDBToModel);
  }

  async getMusicById(id) {
    const query = {
      text: 'SELECT * FROM musics WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('Song not found');

    return result.rows.map(mapDBToModel)[0];
  }

  async editMusicById(id, { title, year, genre, performer, duration }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE musics SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, updated_at = $6 where id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('Failed to update song. Song id not found');
  }

  async deleteMusicById(id) {
    const query = {
      text: 'DELETE FROM musics WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('Failed to delete song. Son id not found');
  }
}

module.exports = MusicsServices;
