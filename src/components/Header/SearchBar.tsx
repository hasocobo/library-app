import Icon from "../../Icon/Icon";
export default function SearchBar() {
  return (
    <div className="relative flex pb-4 sm:pb-0">
      <input
        type="text"
        className="h-8 lg:w-96 md:w-80 sm:w-64 rounded-lg border-2 px-2 transition duration-300 hover:border-red-400"
        placeholder="Ara"
      />
      <div className="absolute right-2 top-1">
        <Icon name={'search'} />
      </div>
    </div>
  )
}