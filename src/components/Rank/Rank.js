import React from 'react';
import './Rank.css';

const Rank = ({ user }) => {
    return  <div className='ranking'>
                {
                    <p>Hey, {user.name.replace(/^\w/, c => c.toUpperCase())}! You've made <span className='f1'>{user.entries}</span> detections.</p>
                }
            </div>
}

export default Rank;