import { GithubUser } from "./GithubUser.js"

class Favorite {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username)
      if (userExists) {
        throw new Error("Usuário já cadastrado")
      }

      const githubUser = await GithubUser.search(username)
      if (githubUser.login === undefined) {
        throw new Error("Usuário não encontrado")
      }

      this.entries = [githubUser, ...this.entries]
      this.save()
      this.update()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    )

    this.entries = filteredEntries
    this.save()
    this.update()
  }
}

export class FavoriteView extends Favorite {
  constructor(root) {
    super(root)

    this.tBody = this.root.querySelector("table tbody")
    this.update()
    this.onAdd()
  }

  update() {
    this.removeAllTableRows()

    this.entries.forEach((user) => {
      const row = this.createTableRow(user)

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?")
        if (isOk) {
          this.delete(user)
        }
      }

      this.tBody.append(row)
    })
  }

  onAdd() {
    const addButton = this.root.querySelector("#add-button")

    addButton.onclick = (e) => {
      e.preventDefault()
      const { value } = this.root.querySelector("#search")

      this.add(value)
    }
  }

  createTableRow({ login, name, public_repos, followers }) {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td class="user">
        <img
          src="https://github.com/${login}.png"
          alt="imagem do perfil"
        />
        <p>
          <a href="#">${name}</a>
          <a href="#">${login}</a>
        </p>
      </td>
      <td>${public_repos}</td>
      <td>${followers}</td>
      <td>
        <button class="remove">&times;</button>
      </td>
    `

    return tr
  }

  removeAllTableRows() {
    this.tBody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}
