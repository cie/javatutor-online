export default function asset(name) {
  return typeof Assets !== 'undefined'
    ? Assets.absoluteFilePath(name)
    : `${__dirname}/../private/${name}`
}

export function assetDir(name) {
  // Assets only works for non-dir files
  return asset('tasks.yml').replace(/tasks\.yml$/, name)
}
