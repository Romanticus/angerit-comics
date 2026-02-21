/**
 * Кадры комикса подтягиваются из src/assets/images автоматически.
 * Порядок — по числу в имени файла (0, 1, 2, … 10), затем по алфавиту.
 */
const modules = import.meta.glob('@/assets/images/*.*', { eager: true })

const pages = Object.entries(modules)
  .sort(([pathA], [pathB]) => {
    const nameA = pathA.split('/').pop() || pathA
    const nameB = pathB.split('/').pop() || pathB
    const numA = parseInt(nameA, 10)
    const numB = parseInt(nameB, 10)
    if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB
    return nameA.localeCompare(nameB, undefined, { numeric: true })
  })
  .map(([, mod], index) => ({
    order: index + 1,
    url: mod.default,
  }))

export default pages
