import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = '20px', radius = 'var(--radius-sm)', style }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="news-card" style={{ height: '350px' }}>
      <Skeleton height="180px" radius="0" />
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Skeleton width="40%" height="16px" />
        <Skeleton width="90%" height="24px" />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" />
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton width="30%" height="14px" />
          <Skeleton width="20%" height="14px" />
        </div>
      </div>
    </div>
  );
};

export const SidebarSkeleton: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ display: 'flex', gap: '15px' }}>
          <Skeleton width="30px" height="30px" radius="var(--radius-full)" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Skeleton width="90%" height="14px" />
            <Skeleton width="40%" height="12px" />
          </div>
        </div>
      ))}
    </div>
  );
};
