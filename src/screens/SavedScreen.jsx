import { SansDialog } from '../components/Sans'
import PlaceList from '../components/PlaceList'

export default function SavedScreen({ results, onSelect, onNavigate }) {
  return (
    <div className="screen">
      <SansDialog
        text={
          results.length
            ? `${results.length} place${results.length === 1 ? '' : 's'} you've kept. i don't judge.`
            : "nothing saved yet. tap the star on any place and it lands here."
        }
        typing={false}
      />

      {results.length === 0 ? (
        <button className="btn btn--gold btn--full" onClick={() => onNavigate('explore')}>
          go find something
        </button>
      ) : (
        <PlaceList results={results} onSelect={onSelect} emptyHint="" />
      )}
    </div>
  )
}
