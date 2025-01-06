// outputs a true or false value depending on the number you enter
// the input is rounded to a number between 0 and 100 and represents the probability
// that true will be returned
export const probabilityOutput = (prob: number) => {

  // force num to be number between 0 and 100
  if (prob > 100){
    prob = 100
  } else if (prob < 0){
    prob = 0
  }

  // generates a value between 0 and 100
  const randVal = Math.random() * 100

  // randVal is compared with prob num input by user. The percentage chance of the randVal being greater
  // than the prob value is roughly equal to percentage value that prob represents between 0 and 100
  if (randVal > prob){
    return false
  } else {
    return true
  }

}