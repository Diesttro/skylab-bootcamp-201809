import React, { Component } from 'react'

class CollaboratorModal extends Component {
    handleCollaboratorChange = event => {
        const collaboratorId = event.target.value

        this.props.onCollaboratorSelection(this.props.postitId, collaboratorId)
    }

    render() {
        const { postitId, collaborators } = this.props

        return <div style={postitId ? {display: 'block'} : {display: 'none'}} className={postitId ? 'modal fade show' : 'modal fade'} id="chooseCollaboratorModal" tabIndex={-1} role="dialog" aria-labelledby="chooseCollaboratorModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="chooseCollaboratorModalLabel">Choose a collaborator</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <select onChange={this.handleCollaboratorChange} defaultValue="none">
                            <option disabled="true" value="none">Choose a collaborator...</option>
                            {collaborators.map(({ id, name }) => <option value={id}>{name}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default CollaboratorModal