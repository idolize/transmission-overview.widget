import { css } from 'uebersicht';

// Root node CSS
export const className = css`
  min-width: 150px;

  top:    1em;
  bottom: 0;
  right:  3%;

  font-family:     'SFNS Display', 'Helvetica Neue', sans-serif;
  font-smoothing:  antialiased;
  color:           white;
  font-size:       32px;
  font-weight:     bold;
  letter-spacing:  0.025em;
  line-height:     .9em;

  text-align:      right;
  text-transform:  uppercase;

  opacity: 0.5;
`;

export const command = 'stig list | grep -v discovering | cut -f1,10,12';

// Example output:
//
// 586839929	0	[ www.Speed.Cd ] - American.Dad.S06E14.720p.HDTV.X264-DIMENSION
// 586015924	0	[ www.Speed.Cd ] - American.Dad.S06E16.720p.HDTV.X264-DIMENSION
// 585641647	0	[ www.Speed.Cd ] - American.Dad.S06E17.720p.HDTV.X264-DIMENSION
// 585706794	0	[ www.Speed.Cd ] - American.Dad.S06E18.720p.HDTV.X264-DIMENSION
// 206159025	0	[ www.Speed.Cd ] - American.Dad.S07E16.720p.HDTV.X264-DIMENSION
// 558379093	0	[ www.Speed.Cd ] - Key.and.Peele.S01E02.720p.HDTV.x264-MOMENTUM
// 585486375	0	[ www.Speed.Cd ] - South.Park.S15E01.720p.HDTV.X264-DIMENSION
// 316283776	0	[ www.Speed.Cd ] - South.Park.S15E08.720p.HDTV.x264-ORENJI
// 461251722	0	[ www.Speed.Cd ] - South.Park.S15E09.720p.HDTV.x264-IMMERSE
// 386610902	0	[ www.Speed.Cd ] - South.Park.S15E14.720p.HDTV.x264-IMMERSE
// 335881857	0	[ www.Speed.Cd ] - South.Park.S16E03.720p.HDTV.x264-2HD
// 183474340	0	American Dad S06E06 HDTV XviD.LOL
// 184069851	0	American Dad S07E08 HDTV XviD-LOL[ettv]
// 183252105	0	American Dad S07E09 HDTV XviD-LOL[ettv]
// 183301623	0	American Dad S07E11 HDTV XviD-LOL[ettv]
// 74787774	0	American Dad S07E15 HDTV x264-LOL[ettv]
// 75820628	0	American Dad S09E20 HDTV x264-2HD[ettv]
// 182137254	0	American.Dad.S04E08.PDTV.XviD-XOR.avi
// 183415398	0	American.Dad.S04E10.Family.Affair.PDTV.XviD-FQM.avi
// 183510058	0	American.Dad.S04E11.PDTV.XviD-XOR.avi

export const refreshFrequency = (1000 * 10); // 10 seconds

function humanFileSize(size) {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

const renderTitle = (active, totalSize) => {
  return active.length ? (
    <span>
      Downloading {active.length} torrent{active.length !== 1 ? 's' : ''} ({totalSize} total)
    </span>
  ) : null;
};

const renderActiveRow = ({ name, size, speed }) => {
  // TODO
  return null;
};

const renderNumInactive = (numInactive) => {
  // TODO
  return null;
};

export const render = ({ output, error }) => {
  if (error || !output) {
    return <span>{error || null}</span>
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
    <div id="content">
      {renderTitle(active, totalDownloadingSize)}
      {active.map(torrent => renderActiveRow(torrent))}
      {renderNumInactive(numInactive)}
    </div>
  );
};
