const local = false

const serverUrl = local ? "http://localhost:8080" : "https://skillshare-server-bay.vercel.app";

module.exports = {
    serverUrl,
}