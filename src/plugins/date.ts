import dayjs from 'dayjs'

const getLocaleDate = (date?: string) => {
  return dayjs(date).format('DD/MM/YYYY')
}

export { dayjs, getLocaleDate }
