import {useState} from "react"

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
const Test = () => {
    const id = "6217da417a6a7b0b57c42086".hashCode()
    console.log(id)
    return(<h1>"Hello</h1>)
}
 
export default Test;