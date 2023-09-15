export class GithubUser {
  static async search(login) {
    const endpoint = `https://api.github.com/users/${login}`

    return fetch(endpoint)
      .then((data) => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers,
      }))
  }
}
