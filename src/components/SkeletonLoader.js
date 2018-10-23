import React from 'react';
import Skeleton from 'react-skeleton-loader';

const SkeletonLoader = () => (
    <div style={{marginBottom: '1em'}} className="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-2">
        <Skeleton width={'100%'} height={'300px'} color={'#3a3838'} animated={false} />
    </div>
);

export default SkeletonLoader;
