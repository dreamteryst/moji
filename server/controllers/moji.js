const db = require('../models')

module.exports = {
  index: async (req, res) => {
    try {
      const mojis = await db.Moji.findAll()
      return res.json(mojis)
    } catch (e) {
      return res.status(500).json({ message: 'Cannot get data from database.' })
    }
  },
  store: async (req, res) => {
    const data = req.body
    if (data) {
      try {
        const moji = await db.sequelize.transaction((t) => {
          return db.Moji.create(data, { transaction: t })
        })
        return res.status(201).json(moji)
      } catch (e) {
        return res.status(500).json({ message: 'Cannot store data to database.' })
      }
    }
    return res.status(400).json({ message: 'Bad request.' })
  },
  update: async (req, res) => {
    const id = req.params.id
    const data = req.body
    if (id && data) {
      await db.sequelize.transaction((t) => {
        return db.Moji.update(data, { where: { id } }, { transaction: t })
      })
      return res.json(data)
    }
    return res.status(400).json({ message: 'Bad request.' })
  },
  destroy: async (req, res) => {
    const id = req.params.id
    if (id) {
      try {
        await db.Moji.destroy({ where: { id } })
        return res.status(204).send()
      } catch (e) {
        return res.status(500).json({ message: 'Cannot remove data from database.' })
      }
    } else {
      return res.status(400).json({ message: 'Bad request.' })
    }
  }
}
