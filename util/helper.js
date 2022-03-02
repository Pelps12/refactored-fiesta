export function toSPKI(str){
    let newString = "-----BEGIN PUBLIC KEY-----"
    return newString.concat(str, "----END PUBLIC KEY-----")
}

export function toPCKS8(str){
    let newString = "-----BEGIN PRIVATE KEY-----"
    return newString.concat(str, "----END PRIVATE KEY-----")
}