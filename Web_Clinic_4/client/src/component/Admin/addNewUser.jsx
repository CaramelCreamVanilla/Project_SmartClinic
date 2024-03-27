import React, { useState } from 'react';
import { useAuth } from '../Authentication/authContext';

function RegistrationForm() {
  const { addUser , user} = useAuth();

  const [formData, setFormData] = useState({
    password:'',
    name: '',
    birthDate: '',
    phoneNumber: '',
    gender: '',
    address: '',
    roleId: '',
    pId: '',
    occupation: '',
    allergy: '',
    congenitalDisease: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData);
    addUser(formData)
  };

  const check = () => {
    console.log(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <img src="http://localhost:3000/UserProfile/acc_profile/1024.png" alt="User Profile" />
      <img src="http://localhost:5555/UserProfile/acc_profile/1024.png" alt="User Profile" />
      {/* ฟิลด์พื้นฐาน */}
      <div>
        <label>N ไอควย docker ใช้ยากสัส:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>BirthDate:</label>
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
      </div>
      <div>
        <label>PhoneNumber:</label>
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
      </div>
      <div>
        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div>
        <label>Address:</label>
        <textarea name="address" value={formData.address} onChange={handleChange} />
      </div>
      <div>
        <label>Role ID:</label>
        <select name="roleId" value={formData.roleId} onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="P">P</option>
          <option value="N">N</option>
        </select>
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
      </div>

      {/* ฟิลด์เพิ่มเติมสำหรับ Role ID = P */}
      {formData.roleId === 'P' && (
        <>
          <div>
            <label>P ID:</label>
            <input type="text" name="pId" value={formData.pId} onChange={handleChange} />
          </div>
          <div>
            <label>Occupation:</label>
            <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} />
          </div>
          <div>
            <label>Allergy:</label>
            <input type="text" name="allergy" value={formData.allergy} onChange={handleChange} />
          </div>
          <div>
            <label>Congenital Disease:</label>
            <input type="text" name="congenitalDisease" value={formData.congenitalDisease} onChange={handleChange} />
          </div>
        </>
      )}

      <button type="submit">Submit</button>
      <button type="button" onClick={check}>check</button>
    </form>
  );
}

export default RegistrationForm;
