function Login() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">캄므커머스 손익사이트</h1>
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex h-10 w-96 rounded-md border border-solid border-black bg-white px-3">
            <input
              type="text"
              placeholder="아이디를 입력해주세요."
              className="h-full w-full"
            />
          </div>
          <div className="flex h-10 w-96 rounded-md border border-solid border-black bg-white px-3">
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요."
              className="h-full w-full"
            />
          </div>
          <button
            type="button"
            className="flex h-10 w-96 items-center justify-center rounded-md bg-gray-400"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
