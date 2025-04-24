const API_URL = 'http://localhost:3000';

export const createStoryApi = async (storyName, storyText, storyImages, longitude, latitude) => {
  const response = await fetch(`${API_URL}/stories/createStory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      storyName, storyText, storyImages, longitude, latitude
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось создать иторию')
  }

  return data;
}

export const getStoriesApi = async () => {
  const response = await fetch(`${API_URL}/stories/getStories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось получить список историй')
  }

  return data
}

export const getMyStoriesApi = async () => {
  const response = await fetch(`${API_URL}/stories/getMyStories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось получить список моих историй')
  }

  return data
}

export const getStoriesByAuthorIdApi = async (authorId) => {
  const response = await fetch(`${API_URL}/stories/getStoriesByAuthorId`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      authorId
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось получить список историй автора')
  }

  return data
}

export const likeStoryApi = async (authorId) => {
  const response = await fetch(`${API_URL}/stories/likeStory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      storyId
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось поставить истории отметку нравится')
  }

  return data
}

export const dislikeStoryApi = async (authorId) => {
  const response = await fetch(`${API_URL}/stories/dislikeStory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      storyId
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось поставить истории отметку не нравится')
  }

  return data
}






export const getGroupInfoById = async (groupId) => {
  const response = await fetch(`${API_URL}/stories/getGroupInfoById`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ 
      groupId
    }),
  })

  const data = await response.json()
  console.log(data)

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось получить список групп');
  }

  return data
}

export const updateGroupDescription = async (description, groupId) => {
  const response = await fetch(`${API_URL}/stories/updateGroupDescription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ 
      description,
      groupId
    })
  })

  const data = await response.json()

  console.log(data)

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data
}


export const joinGroupByCode = async (inviteCode) => {
  const response = await fetch(`${API_URL}/stories/joinGroupByCode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ 
      inviteCode
    }),
  });

  const data = await response.json();

  console.log(data)

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось получить список групп');
  }

  return data;
}

export const startGroupSearch = async (groupId) => {
  const response = await fetch(`${API_URL}/stories/startGroupSearch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ 
      groupId
    }),
  });

  const data = await response.json();

  console.log(data)

  if (!response.ok) {
    throw new Error(data.message || 'Не удалось начать поиск групп');
  }

  return data.group;
}

export const getFoundGroupInfo = async (foundGroupId) => {
  const response = await fetch(`${API_URL}/stories/getFoundGroupInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ 
      foundGroupId
    })
  })

  const data = await response.json();

  console.log(data)

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export const foundGroupDecision = async (myGroupId, decision) => {
  const response = await fetch(`${API_URL}/stories/foundGroupDecision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      myGroupId, 
      decision 
    })
  })

  const data = await response.json();

  console.log(data)

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}


export const getChatData = async (groupId) => {
  const response = await fetch(`${API_URL}/chat/getChatData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      groupId
    })
  })

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}


export const sendMessage = async (groupId, message) => {
  const response = await fetch(`${API_URL}/chat/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      groupId,
      message
    })
  })

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}


export const closeChat = async (groupId) => {
  const response = await fetch(`${API_URL}/chat/closeChat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      groupId
    })
  })

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}