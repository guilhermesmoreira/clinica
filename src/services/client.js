import axios from "axios";

export const HTTPclient = axios.create({baseURL: 'https://pokeapi.co/api/v2', headers: {
    'Access-Controll-Allow-Origins': '*',
    'Access-Controll-Allow-Heades': 'Authorization',
    'Access-Controll-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATH, DELETE',
    'Content-Type': 'application/json;charset=UTF-8',
}})