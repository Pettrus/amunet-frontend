import React from 'react';
import Skeleton from 'react-skeleton-loader';

const SkeletonLoaderModal = () => (
    <div className="row">
        <div className="col-12 col-md-4 text-center">
            <Skeleton width={'100%'}  />
        </div>

        <div className="col-12 col-md-8">
            <div className="text-center">
                <Skeleton width={'70%'} count={2}  />

                <div>
                    <Skeleton  />
                </div>
            </div>

            <p className="text-justify" style={{marginTop: '2em'}}>
                <Skeleton width={'100%'} count={5}  />
            </p>
        </div>
    </div>
);

export default SkeletonLoaderModal;