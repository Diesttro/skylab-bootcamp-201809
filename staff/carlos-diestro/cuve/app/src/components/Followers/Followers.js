import React from 'react'
import './Followers.css'
import { Link } from 'react-router-dom'
import logic from '../../logic'

const Followers = props => {
  return (
    <div>
      {props.user && <div className="block follows my-3">
        {props.user.followers.length > 0 ? <div className="row">
          {props.user.followers.map(user => {
            return (
              <div className="col-2 mx-2 text-center">
                <Link to={`/user/${user.username}`}><img src={user.avatar} alt="" /> @{user.username}</Link>
              </div>
            )
          })}
        </div> : 'No followers'}
      </div>}
    </div>
  )
}

export default Followers