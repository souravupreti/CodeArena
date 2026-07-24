const axios = require('axios');


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{


const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

 return await fetchData();

}


const waiting = (timer) => new Promise(resolve => setTimeout(resolve, timer));

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async(resultToken)=>{

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'true',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

const decodeBase64 = (str) => {
  if (!str) return str;
  return Buffer.from(str, 'base64').toString('utf-8');
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		const data = response.data;
		if (data && data.submissions) {
			data.submissions.forEach(sub => {
				if (sub.stdout) sub.stdout = decodeBase64(sub.stdout);
				if (sub.stderr) sub.stderr = decodeBase64(sub.stderr);
				if (sub.compile_output) sub.compile_output = decodeBase64(sub.compile_output);
				if (sub.message) sub.message = decodeBase64(sub.message);
				if (sub.stdin) sub.stdin = decodeBase64(sub.stdin);
				if (sub.expected_output) sub.expected_output = decodeBase64(sub.expected_output);
			});
		}
		return data;
	} catch (error) {
		console.error(error);
		throw error;
	}
}


 while(true){

  const result =  await fetchData();

  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

  if(IsResultObtained)
    return result.submissions;

  
  await waiting(1000);
}



}


module.exports = {getLanguageById,submitBatch,submitToken};








// 

