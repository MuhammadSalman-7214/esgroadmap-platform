const conversion = {
  s: {
    d: 24 * 60 * 60,
    h: 60 * 60,
    m: 60,
    s: 1,
  },
}

const convertTime = (time: string, to: 's') => {
  const last = time.at(-1)

  if (!last) throw new Error('invalid time')

  const convertor = conversion[to]

  if (last in convertor) {
    let timeInInt = parseInt(time.slice(0, time.length - 1))

    return timeInInt * convertor[last as keyof typeof convertor]
  }

  throw new Error('invalid time')
}

export default convertTime;