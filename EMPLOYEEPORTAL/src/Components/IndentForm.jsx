import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const IndentForm = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name_and_designation_of_the_indenter: '',
        personal_file_no: '',
        office_project: '',
        project_no_and_title: '',
        budget_head: '',
        items_head: '',
        type_of_purchase: '',
        issue_gst_exemption_certificate: '',
        item_details: [
            { name: '', cost: '', qty: 1, amount: 0, required_by: '', warranty: '', remarks: '' }
        ],
        teamlead_id: localStorage.getItem("teamLeadId") || null
    });

    // 💡 Update Form Field
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💡 Handle Item Change (Name, Cost, etc.)
    const handleItemChange = (index, e) => {
        const items = [...formData.item_details];
        const { name, value } = e.target;
    
        // Update value
        items[index][name] = value;
    
        // Recalculate amount when cost or qty changes
        if (name === 'cost' || name === 'qty') {
            const cost = parseFloat(items[index].cost) || 0;    // Price per item
            const qty = parseInt(items[index].qty) || 0;        // Total quantity
            items[index].amount = cost * qty;                    // Total amount = cost * qty
        }
    
        setFormData({ ...formData, item_details: items });
    };
    

    // 💡 Handle Quantity Change (with stepper buttons)
    const handleQtyChange = (index, qty) => {
        const items = [...formData.item_details];
        items[index].qty = qty;
        items[index].amount = (parseFloat(items[index].cost) || 0) * qty;

        setFormData({ ...formData, item_details: items });
    };

    // 💡 Add Item Row
    const addItemRow = () => {
        setFormData({
            ...formData,
            item_details: [
                ...formData.item_details,
                { name: '', cost: '', qty: 1, amount: 0, required_by: '', warranty: '', remarks: '' }
            ]
        });
    };

    // 💡 Remove Item Row
    const removeItemRow = (index) => {
        const items = [...formData.item_details];
        items.splice(index, 1);
        setFormData({ ...formData, item_details: items });
    };

    // 💡 Calculate Total Cost
    const getTotalCost = () => {
        return formData.item_details.reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);
    };

    // 💡 Submit Form
    const handleSubmit = () => {
        const finalData = {
            ...formData,
            teamlead_id: localStorage.getItem("teamLeadId")
        };

        axios.post('http://localhost:3001/auth/submit_indent', finalData)
            .then(response => {
                if (response.data.success) {
                    alert('Indent Request Submitted Successfully');
                    navigate('/dashboard/asset_requests');
                } else {
                    alert('Failed to submit indent request');
                }
            })
            .catch(error => console.error('Error submitting indent request', error));
    };

    return (
        <div className="container mt-4">
            <h2>Purchase Indent Form</h2>

            {step === 1 && (
                <>
                    <h3>Page 1: Employee Details & Items</h3>
                    <table className="table table-bordered">
                        <tbody>
                            <tr><td>Name & Designation of the Indenter</td><td><input type="text" name="name_and_designation_of_the_indenter" value={formData.name_and_designation_of_the_indenter} onChange={handleChange} /></td></tr>
                            <tr><td>Personal File No</td><td><input type="text" name="personal_file_no" value={formData.personal_file_no} onChange={handleChange} /></td></tr>
                            <tr><td>Office/Project</td><td><input type="text" name="office_project" value={formData.office_project} onChange={handleChange} /></td></tr>
                            <tr><td>Project No. & Title (if any)</td><td><input type="text" name="project_no_and_title" value={formData.project_no_and_title} onChange={handleChange} /></td></tr>
                            <tr><td>Budget Head</td><td>
                                <select name="budget_head" value={formData.budget_head} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="RECURRING">RECURRING</option>
                                    <option value="NON-RECURRING">NON-RECURRING</option>
                                </select>
                            </td></tr>
                            <tr><td>Items Head</td><td>
                                <select name="items_head" value={formData.items_head} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="MANPOWER">MANPOWER</option>
                                    <option value="TRAVEL">TRAVEL</option>
                                    <option value="CONTINGENCY">CONTINGENCY</option>
                                    <option value="CONSUMABLES">CONSUMABLES</option>
                                    <option value="MISC">MISC</option>
                                </select>
                            </td></tr>
                            <tr><td>Type of Purchase</td><td>
                                <select name="type_of_purchase" value={formData.type_of_purchase} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="GOODS">GOODS</option>
                                    <option value="SERVICES">SERVICES</option>
                                </select>
                            </td></tr>
                            <tr><td>Issue GST Exemption Certificate</td><td>
                                <select name="issue_gst_exemption_certificate" value={formData.issue_gst_exemption_certificate} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="YES">YES</option>
                                    <option value="NO">NO</option>
                                </select>
                            </td></tr>
                        </tbody>
                    </table>

                    <h4>Details of Items Being Demanded</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th><th>Cost</th><th>Qty</th><th>Amount in total</th><th>Required By (in days)</th><th>Warranty</th><th>Remarks</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
    {formData.item_details.map((item, index) => (
        <tr key={index}>
            <td>
                <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e)}
                    className="form-control"
                />
            </td>
            <td>
                <input
                    type="number"
                    name="cost"
                    value={item.cost}
                    onChange={(e) => handleItemChange(index, e)}
                    className="form-control"
                    min="0"
                />
            </td>
            <td>
                {/* Qty as number input with stepper arrows */}
                <input
                    type="number"
                    name="qty"
                    value={item.qty}
                    onChange={(e) => handleItemChange(index, e)}
                    className="form-control"
                    min="1"
                />
            </td>
            <td>
                <input
                    type="number"
                    name="amount"
                    value={item.amount}
                    className="form-control"
                    readOnly
                />
            </td>
            <td>
                <input
                    type="text"
                    name="required_by"
                    value={item.required_by}
                    onChange={(e) => handleItemChange(index, e)}
                    className="form-control"
                />
            </td>
            <td>
                <input
                    type="text"
                    name="warranty"
                    value={item.warranty}
                    onChange={(e) => handleItemChange(index, e)}
                    className="form-control"
                />
            </td>
            <td>
                <input
                    type="text"
                    name="remarks"
                    value={item.remarks}
                    onChange={(e) => handleItemChange(index, e)}
                    className="form-control"
                />
            </td>
            <td>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => removeItemRow(index)}
                >
                    🗑️
                </button>
            </td>
        </tr>
    ))}
</tbody>

                    </table>

                    <button type="button" onClick={addItemRow}>+ Add Row</button>
                    <button type="button" onClick={() => setStep(2)}>Next</button>
                    
                </>
            )}

{step === 2 && (
    <>
        <h3>Page 2: Approval & Review (Read Only Preview)</h3>

        {/* Procurement TL Section - Checklist */}
        <h4 className="mt-4">For Office of Stores and Purchase only</h4>
        <table className="table table-bordered">
            <thead>
                <tr><th colSpan="2" className="text-center">CHECKLIST</th></tr>
            </thead>
            <tbody>
                <tr><td>1. Budget head specified</td><td>Yes / No</td></tr>
                <tr><td>2. Availability of Space at Stores</td><td>Yes / No</td></tr>
                <tr><td>3. Specifications enclosed</td><td>Yes / No</td></tr>
                <tr><td>4. <i>Items</i> working condition</td><td>Yes / No</td></tr>
                <tr><td>5. Any Deviation</td><td>______________________</td></tr>
            </tbody>
        </table>

        {/* Procurement TL Section - Mode of Purchase */}
        <h5 className="mt-3"><b>MODE OF PURCHASE</b></h5>
        <ul>
            <li>Direct Purchase (below 50 K)</li>
            <li>Three quotation basis (above 50 K to 5 Lac) Limited</li>
            <li>Tender Enquiry</li>
            <li>Open Tender Enquiry</li>
            <li>Repeat Order</li>
            <li>Proprietary</li>
        </ul>
        <p className="mt-2"><i>(Tick whichever is applicable)</i></p>

        {/* Procurement Comments */}
        <p><b>Comments (if any):</b></p>
        <p>_____________________________</p>

        <p className="text-end"><b>Officer-in-Charge (Stores and Purchase)</b></p>

        {/* PFC Section */}
        <h5 className="mt-4 text-center">Constitution of Purchase Finalization Committee (PFC)</h5>
        <table className="table table-bordered">
            <tbody>
                <tr><td>Chairman (PI/CEO/PD/Nominated by Competent Authority)</td><td>______________________</td></tr>
                <tr><td>Indenter</td><td>______________________</td></tr>
                <tr><td>Expert 1 (Senior Employee/Nominated by Competent Authority)</td><td>______________________</td></tr>
                <tr><td>Expert 2 (Honorary Member/Nominated by Competent Authority)</td><td>______________________</td></tr>
                <tr><td>One Member from Finance Team (Nominated by Competent Authority)</td><td>______________________</td></tr>
            </tbody>
        </table>
        <p className="text-end"><b>(Signature of Competent Authority)</b></p>

        {/* Chairman Approval Section */}
        <h5 className="mt-4 text-center">Approval Section</h5>
        <table className="table table-bordered">
            <tbody>
                <tr>
                    <td>
                        <b>PI</b><br />
                        (Up to Rs. 5 Lakh)<br />
                        <small>Note: Non-Recurring: Rs. 50,000<br />Recurring: Rs. 5,00,000 (For Project Purchase)</small>
                    </td>
                    <td><b>PROJECT DIRECTOR/CEO</b><br />(Up to Rs. 50 Lac)</td>
                    <td><b>CHAIRMAN</b><br />(Full Power)</td>
                </tr>
            </tbody>
        </table>

        {/* Office of Accounts Section */}
        <h4 className="mt-4">For Office of Accounts only</h4>
        <table className="table table-bordered">
            <tbody>
                <tr><td>Budget allocation of the Office/Project</td><td>______________________</td></tr>
                <tr><td>Budget utilized</td><td>______________________</td></tr>
                <tr><td>Available balance</td><td>______________________</td></tr>
                <tr><td>Are funds available in the budget head requested by the Project/Office?</td><td>Yes / No</td></tr>
                <tr><td>Comments (if any)</td><td>______________________</td></tr>
            </tbody>
        </table>
        <p className="text-end"><b>Officer-in-Charge (Accounts)</b></p>

        <div className="mt-4 d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-success" onClick={handleSubmit}>Submit Request</button>
        </div>
    </>
)}

        </div>
    );
};

export default IndentForm;