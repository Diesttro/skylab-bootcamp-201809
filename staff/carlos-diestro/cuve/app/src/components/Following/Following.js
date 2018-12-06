import React from 'react'
import './Following.css'
import { Link } from 'react-router-dom'
import logic from '../../logic'

const Following = props => {
  return (
    <div>
      {props.user && <div className="block follows my-3">
        {props.user.following.length > 0 ? <div className="row">
          {props.user.following.map(user => {
            return (
              <div className="col-2 mx-2 text-center">
                <Link to={`/user/${user.username}`}><img src={logic.url + user.avatar} alt="" /> @{user.username}</Link>
              </div>
            )
          })}
        </div> : 'No following'}
      </div>}
    </div>
  )
}

export default Following