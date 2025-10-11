"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { GENDER_LIST, GRADE_LIST } from "@/constants";
import * as validate from "@/utils/validate";
import {
  Logo,
  AuthInput,
  ProcessAuth,
  AuthButton,
  DateInput,
  SuccessCircle,
} from "@/components";
import { cleanObjectStrict, parseDateString } from "@/utils";
import { RegisterStudentRequest } from "@/types";
import { Dropdown } from "@/components";

export const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterStudentRequest>({
    lastName: "",
    firstName: "",
    username: "",
    gender: undefined,
    dateOfBirth: undefined,
    school: "",
    grade: undefined,
    email: "",
    password: "",
  });
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Tính tiến trình dựa trên step hiện tại, không phụ thuộc vào việc nhập trường
  const getProgressPercent = () => {
    if (success) {
      // Khi đăng ký thành công, thanh tiến trình chạy đến 100%
      return 100;
    }

    if (currentStep === 1) {
      // Ở step 1, tiến trình ở 0% đến 33%
      let step1Progress = 0;
      const fieldsInStep1 = 4; // lastName, firstName, gender, dob

      if (formData.lastName) step1Progress += 33 / fieldsInStep1;
      if (formData.firstName) step1Progress += 33 / fieldsInStep1;
      if (formData.gender) step1Progress += 33 / fieldsInStep1;
      if (dob !== "" && dob.length === 10) step1Progress += 33 / fieldsInStep1;

      return step1Progress;
    } else if (currentStep === 2) {
      // Ở step 2, step 1 đã hoàn thành (33%) + progress của step 2 (0-33%)
      let step2Progress = 33; // Step 1 hoàn thành
      const fieldsInStep2 = 2; // grade, school

      if (formData.grade) step2Progress += 33 / fieldsInStep2;
      if (formData.school) step2Progress += 33 / fieldsInStep2;

      return step2Progress;
    } else if (currentStep === 3) {
      // Ở step 3, step 1,2 đã hoàn thành (50%) + progress của step 3 (0-33%)
      let step3Progress = 66; // Step 1,2 hoàn thành
      const fieldsInStep3 = 4; // username, email, password, confirmPassword

      if (formData.username) step3Progress += 33 / fieldsInStep3;
      if (formData.email) step3Progress += 33 / fieldsInStep3; // Email không bắt buộc nhưng vẫn tính
      if (formData.password) step3Progress += 33 / fieldsInStep3;
      if (confirmPassword) step3Progress += 33 / fieldsInStep3;

      return step3Progress;
    }
    return 0;
  };

  const progressPercent = getProgressPercent();

  // Kiểm tra các trường bắt buộc cho từng step
  const isStep1Complete = () => {
    return formData.lastName.trim() !== "" && formData.firstName.trim() !== "";
    // Gender và dob không bắt buộc
  };

  const isStep2Complete = () => {
    return formData.grade !== undefined && (formData.school?.trim() !== "" && formData.school !== undefined);
  };

  const isStep3Complete = () => {
    return (
      formData.username.trim() !== "" &&
      formData.password.trim() !== "" &&
      confirmPassword.trim() !== ""
      // Email không bắt buộc
    );
  };

  // Kiểm tra button có được enable hay không
  const isNextButtonEnabled = () => {
    if (currentStep === 1) return isStep1Complete();
    if (currentStep === 2) return isStep2Complete();
    if (currentStep === 3) return isStep3Complete();
    return false;
  };

  const nextStep = () => {
    if (currentStep == 1 && !handleValidateStep1()) return;
    if (currentStep == 2 && !handleValidateStep2()) return;
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleValidateStep2 = () => {
    if (!validate.validateGrade(formData.grade)) return false;
    if (!validate.validateSchool(formData.school)) return false;

    return true;
  };

  const handleValidateStep1 = () => {
    if (!validate.validateName(formData.firstName, formData.lastName))
      return false;
    if (dob != "" && !validate.validateDateOfBirth(dob)) return false;
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate lần lượt
    if (!validate.validateName(formData.firstName, formData.lastName)) return;
    if (formData.email !== "" && !validate.validateEmail(formData.email))
      return;
    if (!validate.validatePassword(formData.password)) return;
    if (!validate.validateConfirmPassword(formData.password, confirmPassword))
      return;
    if (dob != "") {
      if (!validate.validateDateOfBirth(dob)) return;
      else {
        const dateOfBirth = parseDateString(dob);
        formData.dateOfBirth = dateOfBirth ? dateOfBirth : undefined;
      }
    }
    if (!validate.validateSchool(formData.school)) return;
    if (!validate.validateGrade(formData.grade)) return;
    if (!validate.validateUsername(formData.username)) return;
    const cleanFormData = cleanObjectStrict(formData);

    // const resultAction = await register(cleanFormData);

    // if (resultAction.meta.requestStatus === "fulfilled") {
    //   setSuccess(true);
    // }
    setSuccess(true);
  };

  return (
    <div className="flex w-full justify-center items-center flex-col md:gap-6 gap-3">
      <div className="flex w-full justify-center items-center flex-col gap-1">
        <div className='flex w-full flex-col justify-center items-center 2xl:gap-15 md:gap-12 gap-6'>
          <div className='flex w-full justify-center items-center gap-6 flex-row'>
            <Logo
            />
            <p className="text-primary text-3xl md:text-4xl font-bold font-open-sans">
              Đăng ký
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6 md:mb-12 flex w-full">
        <ProcessAuth
          success={success}
          currentStep={currentStep}
          percent={progressPercent}
        />
      </div>
      <form
        onSubmit={handleRegister}
        className="flex w-full flex-col justify-center items-center md:gap-6 gap-3"
      >
        {success ? (
          <div className="md:gap-6 gap-3 flex w-full flex-col justify-center items-center">
            <div className="md:mb-12 md:gap-6 gap-3 flex w-full flex-col justify-center items-center">
              <p className="text-2xl font-bold text-primary font-open-sans">
                Tạo tài khoản thành công
              </p>
              <SuccessCircle />
            </div>
            <AuthButton
              onClick={() => router.push("/auth/login")}
              variant="outline"
            >
              <div className="text-primary">Đăng nhập ngay</div>
            </AuthButton>
          </div>
        ) : (
          <>
            {currentStep == 1 && (
              <>
                <div className="flex w-full flex-row justify-between items-center md:gap-6 gap-3">
                  <AuthInput
                    name="lastName" // 🔑 thêm name
                    value={formData.lastName}
                    onChange={handleChange}
                    label="Họ"
                    type="text"
                    required
                  />
                  <AuthInput
                    name="firstName" // 🔑 thêm name
                    value={formData.firstName}
                    onChange={handleChange}
                    label="Tên"
                    type="text"
                    required
                  />
                </div>
                <Dropdown
                  onSelect={(value) => {
                    setFormData({
                      ...formData,
                      gender: value,
                    });
                  }}
                  value={formData.gender}
                  label="Giới tính"
                  options={GENDER_LIST}
                />
                <DateInput
                  id="dateOfBirth"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  label="Ngày tháng năm sinh"
                />
              </>
            )}
            {currentStep == 2 && (
              <>
                <Dropdown
                  onSelect={(value) => {
                    setFormData({
                      ...formData,
                      grade: value,
                    });
                  }}
                  value={formData.grade}
                  required
                  label="Khối"
                  options={GRADE_LIST}
                />
                <AuthInput
                  name="school" // 🔑 thêm name
                  value={formData.school}
                  onChange={handleChange}
                  label="Trường"
                  type="text"
                  required
                />
              </>
            )}
            {currentStep == 3 && (
              <>
                <AuthInput
                  name="username" // 🔑 thêm name
                  value={formData.username}
                  onChange={handleChange}
                  label="Tên đăng nhập"
                  type="text"
                  required
                />
                <AuthInput
                  name="email" // 🔑 thêm name
                  value={formData.email}
                  onChange={handleChange}
                  label="Email"
                  type="text"
                />
                <AuthInput
                  name="password" // 🔑 thêm name
                  value={formData.password}
                  onChange={handleChange}
                  label="Mật khẩu"
                  type="password"
                  required
                />
                <AuthInput
                  name="confirmPassword" // 🔑 thêm name
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="Nhập lại mật khẩu"
                  type="password"
                  required
                />
              </>
            )}
            {currentStep == 3 && (
              <AuthButton
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={!isNextButtonEnabled()}
              >
                <div className="text-white ">Đăng ký</div>
              </AuthButton>
            )}
            {currentStep < 3 && (
              <AuthButton
                onClick={nextStep}
                variant="secondary"
                disabled={!isNextButtonEnabled()}
              >
                Tiếp theo
              </AuthButton>
            )}
            {currentStep > 1 && (
              <AuthButton onClick={prevStep} variant="outline">
                Quay lại
              </AuthButton>
            )}
            <div className="w-full flex justify-center items-center">
              <p>
                <span className="text-black text-base font-normal font-open-sans">
                  Đã có tài khoản?{" "}
                </span>
                <Link
                  href={"/auth/login"}
                  className="hover:underline cursor-pointer text-primary text-base font-semibold font-open-sans"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;
