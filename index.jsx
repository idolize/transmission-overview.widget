import { css } from 'uebersicht';

// Root node CSS
export const className = css`
  & table {
    border-collapse: collapse;
    margin-right:    auto;
    color:           white;
    font-size:       12px;
    font-weight:     normal;
    letter-spacing:  0.025em;
    line-height:     .9em;
  }
  & table td {
    padding-top: 5px;
    padding-bottom: 5px;
  }
  & table td + td {
    border-left: 1px solid rgba(255, 255, 255, 0.5);
    padding-left: 10px;
  }
  & table td:not(:last-child) {
    padding-right: 10px;
  }

  min-width: 150px;

  top:    32px;
  bottom: 0;
  left:  3%;

  opacity: 0.5;
`;

const titleCss = css`
  font-size:       16px;
  padding-bottom:  16px;
`;

const contentCss = css`
  font-family:     'SFNS Display', 'Helvetica Neue', sans-serif;
  font-smoothing:  antialiased;
  color:           white;
  font-size:       12px;
  font-weight:     bold;
  letter-spacing:  0.025em;
  line-height:     .9em;

  display:         flex;
  justify-items:   flex-begin;
  flex-direction:  column;
`;

export const command = 'stig list | grep -v discovering | cut -f1,10,12';

export const refreshFrequency = (1000 * 7); // 7 seconds

function humanFileSize(size) {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

const NumInactive = ({ numInactive }) => {
  return (
    <span>{numInactive} inactive torrents</span>
    );
  };
  
  const TitleArea = ({ active, totalSize, numInactive }) => {
    const seperator = (active.length && numInactive) ? (
      <span style={{ padding: '0 6px' }}> — </span>
      ) : null;
      return (
        <div className={titleCss}>
      {active.length ? (
        <span>
          Downloading {active.length} torrent{active.length !== 1 ? 's' : ''} ({humanFileSize(totalSize)} total)
        </span>
      ) : null}
      {seperator}
      {numInactive ? (
        <NumInactive numInactive={numInactive} />
        ) : null}
    </div>
  );
};

const ActiveRow = ({ torrent: { name, size, speed } }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{humanFileSize(size)}</td>
      <td>{humanFileSize(speed)}/s</td>
    </tr>
  );
};

const MAX_ACTIVE_ROWS = 10;

export const render = ({ output, error }) => {
  if (error || !output) {
    return <span>{error || null}</span>;
  }
  const active = [];
  let totalDownloadingSize = 0;
  let numInactive = 0;
  const lines = output.split('\n').filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    const [sizeStr, speedStr, name] = lines[i].split(/\t/).filter(Boolean);
    const size = parseInt(sizeStr);
    const speed = parseInt(speedStr);
    if (speed > 0 && size > 0) {
      active.push({ size, speed, name });
      totalDownloadingSize += size;
    } else {
      numInactive++;
    }
  }
  return (
    <div className={contentCss}>
      <TitleArea active={active} totalSize={totalDownloadingSize} numInactive={numInactive} />
      <table>
        <tbody>
          {
            (active.length > MAX_ACTIVE_ROWS ? active.slice(0, MAX_ACTIVE_ROWS) : active)
              .map(torrent => <ActiveRow key={torrent.name} torrent={torrent} />)
          }
        </tbody>
        {active.length > MAX_ACTIVE_ROWS ? (
          <tfoot>
            <tr><td colSpan={100}>...</td></tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
};
