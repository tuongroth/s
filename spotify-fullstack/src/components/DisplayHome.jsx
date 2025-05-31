import React, { useContext } from 'react';
import Navbar from './Navbar';
import SongItem from './SongItem';
import AlbumItem from './AlbumItem';
import { PlayerContext } from '../context/PlayContext'; // dùng dữ liệu thực

const DisplayHome = () => {
  const { albums, songs } = useContext(PlayerContext); // lấy dữ liệu từ context

  return (
    <>
      <Navbar />

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
        <div className="flex overflow-x-auto pl-4 space-x-4 scrollbar-hide">
          {albums.map((item) => (
            <AlbumItem 
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              desc={item.description || item.desc} // tuỳ theo backend trả về
            />
          ))}
        </div>
      </div>

      <div className="my-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex overflow-x-auto pl-4 space-x-4 scrollbar-hide">
          {songs.map((item) => (
            <SongItem
              key={item._id}
              id={item._id}
              name={item.name}
              desc={item.description || item.desc}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayHome;
