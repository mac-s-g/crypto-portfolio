import React from "react"

export const environment = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : "production"

export const theme = {
  colors: {
    inverted: "#044d6e",
    blue: "#044d6e",
    well_gray: "#f5f5f5",
    well_border: "#bbb",
    logo: "#FAA916",
    green: "#33aa11",
    gold: "#faa916",
    gray: "#aaa",
    grey: "#aaa",
    gray_dark: "rgba(0,0,0,0.6)",
    grey_dark: "rgba(0,0,0,0.6)",
    gray_table: "#f9fafb",
    red: "#dd4444",
    black: "#222",
    purple: "#335577",
    white: "#fff"
  },
  dash_nav_height: "4em",
  dash_footer_height: "2.3em"
}
export const project_info = {
  name: "CoinOrbital",
  author: {
    name: "Mac Gainor",
    email: "coinorbital@gmail.com"
  },
  donation: {
    BTC: {
      name: "Bitcoin",
      address: "36Cp7HHpcyTESXXH5yGhfvqqae2wFxh3H2"
    },
    ETH: {
      name: "Ethereum",
      address: "0x9aB9335290fEF07aBf4Daa5a75651e77b3CE35Db"
    },
    LTC: {
      name: "Litecoin",
      address: "MEL7cts5NfcQUwjWjtfEcqHTcJmjavECgL"
    },
    BCH: {
      name: "Bitcoin Cash",
      address: "14ztfbFRhitxDKi3Z5vjHoMgDhZV27ZKZK"
    }
  },
  description_brief: "Track your crypto portfolio like a pro."
}

export const links = {
  author_avatar: "https://s3.amazonaws.com/www.coinorbital.com/logo-150-150.png"
}

export const authentication = {
  domain: "coinorbital.auth0.com",
  client_id: "2MT_mTDqLflzVfPJ54sOx5I86lFr23Ml",
  callback_path: "/callback/",
  redirect_path: "/dashboard/",
  audience: "https://coinorbital.com/api/authorize"
}

export const api = {
  domain: CO_API_HOST,
  paths: {
    user: "user/",
    investment: "user/investments/",
    watchlist: "user/watchlist/"
  }
}

export const local_user = "local-user"
export const ga_tracking_id = "UA-120202558-1"
