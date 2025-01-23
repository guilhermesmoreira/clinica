import { HTTPclient } from "./client"

export default {
    obterPokemon(nome){
        return HTTPclient.get(`pokemon/${nome}`)
    }
}
