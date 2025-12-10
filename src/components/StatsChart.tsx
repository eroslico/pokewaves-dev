import { Pokemon } from '@/types/pokemon';
import { formatStatName } from '@/lib/pokemon-utils';

interface StatsChartProps {
  pokemon: Pokemon;
  size?: 'sm' | 'md' | 'lg';
}

export const StatsChart = ({ pokemon, size = 'md' }: StatsChartProps) => {
  const stats = pokemon.stats;
  const maxStat = 255;
  
  const sizeConfig = {
    sm: { width: 120, height: 120, fontSize: 8 },
    md: { width: 200, height: 200, fontSize: 10 },
    lg: { width: 280, height: 280, fontSize: 12 },
  };

  const config = sizeConfig[size];
  const center = config.width / 2;
  const radius = (config.width / 2) - 40;

  // Calculate points for hexagon
  const getPoint = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const distance = (value / maxStat) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  const points = stats.map((stat, index) => 
    getPoint(stat.base_stat, index, stats.length)
  );

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Background hexagon (max values)
  const maxPoints = stats.map((_, index) => 
    getPoint(maxStat, index, stats.length)
  );
  const maxPolygonPoints = maxPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Grid lines
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="relative flex items-center justify-center">
      <svg 
        width={config.width} 
        height={config.height}
        className="drop-shadow-lg"
      >
        {/* Grid lines */}
        {gridLevels.map((level, i) => {
          const gridPoints = stats.map((_, index) => 
            getPoint(maxStat * level, index, stats.length)
          );
          const gridPolygonPoints = gridPoints.map(p => `${p.x},${p.y}`).join(' ');
          
          return (
            <polygon
              key={i}
              points={gridPolygonPoints}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Axis lines */}
        {stats.map((_, index) => {
          const point = getPoint(maxStat, index, stats.length);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Stat polygon */}
        <polygon
          points={polygonPoints}
          fill="hsl(var(--primary))"
          fillOpacity="0.3"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          className="transition-all duration-500"
        />

        {/* Stat points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="hsl(var(--primary))"
              className="transition-all duration-500 hover:r-6"
            />
          </g>
        ))}

        {/* Labels */}
        {stats.map((stat, index) => {
          const labelPoint = getPoint(maxStat + 20, index, stats.length);
          const statName = formatStatName(stat.stat.name);
          
          return (
            <text
              key={index}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={config.fontSize}
              fontWeight="600"
              fill="hsl(var(--foreground))"
              className="select-none"
            >
              {statName}
            </text>
          );
        })}
      </svg>

      {/* Total stat in center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center glass-strong rounded-full p-3 shadow-lg">
          <div className="text-xs text-muted-foreground font-medium">Total</div>
          <div className="text-xl font-bold gradient-text">
            {stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};
