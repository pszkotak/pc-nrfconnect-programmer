/* Copyright (c) 2015 - 2017, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react';
import { Button, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { overlapBlockSets } from 'nrf-intel-hex';

import FileLegend from './FileLegend';

const ControlPanel = props => {


//     function openRecent(, ev) {
//         console.log('Open recent: ', ev.target.innerText);
//     }

    const overlaps = overlapBlockSets(props.blocks);
    console.log(overlaps);
    let overlapWarning = "";
    for (const [address, overlap] of overlaps) {
        if (overlap.length > 1) {
            overlapWarning = (<div className="alert alert-warning">
                <center><Glyphicon glyph='warning-sign' style={{ fontSize: '3em' }}/></center>
                <p><strong>Caution!</strong> Some of the .hex files have overlapping data.</p>
                <p>In regions with overlapping data, data from the file which was <strong>last</strong> added will be used.</p>
            </div>);
        }
    }


    let mruMenuItems;

    if (props.mruFiles.length) {
        mruMenuItems = props.mruFiles.map((filename)=>{
            return (<MenuItem onSelect={ ()=>props.openFile(filename) }>{filename}</MenuItem>);
        });
    } else {
        mruMenuItems = (<MenuItem disabled='disabled'>No recently used files</MenuItem>);
    }

//             <button onClick={props.openFileDialog}>Add .hex files...</button>
//             <Button disabled="disabled" style={{ color: 'graytext' }}>Add last files written to this device</Button>

    return (
        <div>
            <Button onClick={props.closeFiles}>
                <Glyphicon glyph='folder-close' />Clear files
            </Button>
            <Dropdown pullRight={true}>
                <Dropdown.Toggle>
                    <Glyphicon glyph='folder-open' />Add a .hex file
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    { mruMenuItems }
                    <MenuItem divider='divider' />
                    <MenuItem onSelect={ props.openFileDialog }>Browse...</MenuItem>
                </Dropdown.Menu>
            </Dropdown>
            <Button disabled="disabled" style={{ color: 'graytext' }}>
                <Glyphicon glyph='refresh' />Reload .hex files
            </Button>

            <FileLegend fileColours={props.fileColours} />

            { overlapWarning }

            <Button onClick={props.performWrite} disabled={ !props.targetIsReady }>
                <Glyphicon glyph='flash' />Write all to devkit
            </Button>

            <Button onClick={props.performRecover} disabled={ !props.targetIsReady }>
                <Glyphicon glyph='trash' />Recover (full erase)
            </Button>
        </div>
    );
}

ControlPanel.propTypes = {
    closeFiles: PropTypes.func.isRequired,
    openFileDialog: PropTypes.func.isRequired,
    performWrite: PropTypes.func.isRequired,
    performRecover: PropTypes.func.isRequired,
    fileColours: PropTypes.instanceOf(Map).isRequired,
//     mruFiles: PropTypes.
};

export default ControlPanel;