function handleize(string) {
    if(typeof string === 'string')
        return string.replace(/ /g, "-").toLowerCase()
    else {
        throw new Error("Handleization Error")
    }
}

module.exports = {
    handleize: handleize
}