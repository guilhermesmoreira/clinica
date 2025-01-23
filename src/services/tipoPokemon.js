import { HTTPclient } from "./client"

export default {
    obterTipoPokemon(tipo){
        return HTTPclient.get(`type/${tipo}`)
    }
}