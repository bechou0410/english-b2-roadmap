// Ngân hàng đề kiểm tra đầu vào (mỗi lượt thi rút 6 câu/mức A1-B2).
window.PLACEMENT = {
  "intro_vi": "Bài kiểm tra đầu vào này giúp bạn xác định trình độ tiếng Anh hiện tại (từ A1 đến B2) để chọn điểm bắt đầu phù hợp trên Lộ trình B2. Bài gồm 24 câu trắc nghiệm về ngữ pháp, từ vựng và đọc hiểu, xếp từ dễ đến khó, làm trong khoảng 15-20 phút. Lưu ý: hãy làm một mình, không tra từ điển hay công cụ dịch — kết quả chỉ chính xác khi phản ánh đúng những gì bạn thật sự biết.",
  "duration_min": 18,
  "questions": [
    {
      "level": "A1",
      "skill": "grammar",
      "question": "My sister ___ a nurse. She works at a big hospital in Da Nang.",
      "options": [
        "am",
        "is",
        "are",
        "be"
      ],
      "answer": 1,
      "explain_vi": "Chủ ngữ \"My sister\" là ngôi thứ ba số ít nên động từ to be phải là \"is\". \"Am\" chỉ đi với \"I\", \"are\" đi với you/we/they, còn \"be\" là dạng nguyên mẫu không dùng làm động từ chính ở đây — lỗi bỏ quên chia to be rất phổ biến với người Việt."
    },
    {
      "level": "A1",
      "skill": "grammar",
      "question": "Minh ___ coffee every morning before going to work.",
      "options": [
        "drink",
        "is drink",
        "drinks",
        "drinking"
      ],
      "answer": 2,
      "explain_vi": "Thì hiện tại đơn với chủ ngữ ngôi ba số ít (Minh) phải thêm -s: \"drinks\". \"Drink\" thiếu -s là lỗi người Việt hay mắc nhất; \"is drink\" sai cấu trúc (không dùng to be + động từ nguyên mẫu); \"drinking\" thiếu trợ động từ \"is\" và cũng không hợp với \"every morning\"."
    },
    {
      "level": "A1",
      "skill": "grammar",
      "question": "That is my brother. ___ name is Duc.",
      "options": [
        "His",
        "He",
        "Him",
        "He's"
      ],
      "answer": 0,
      "explain_vi": "Trước danh từ \"name\" cần tính từ sở hữu \"His\" (tên của anh ấy). \"He\" là đại từ chủ ngữ, \"Him\" là đại từ tân ngữ, còn \"He's\" là viết tắt của \"He is\" — người Việt hay nhầm \"He's name\" vì phát âm giống \"His\"."
    },
    {
      "level": "A1",
      "skill": "vocabulary",
      "question": "I'm very hungry. Let's find something to ___.",
      "options": [
        "sleep",
        "read",
        "drink",
        "eat"
      ],
      "answer": 3,
      "explain_vi": "\"Hungry\" nghĩa là đói, nên cần tìm gì đó để ăn — \"eat\". \"Drink\" (uống) là bẫy vì nó đi với \"thirsty\" (khát); \"sleep\" (ngủ) và \"read\" (đọc) không liên quan đến cơn đói."
    },
    {
      "level": "A1",
      "skill": "vocabulary",
      "question": "It's raining outside. Don't forget to take your ___!",
      "options": [
        "wallet",
        "umbrella",
        "sunglasses",
        "camera"
      ],
      "answer": 1,
      "explain_vi": "Trời mưa thì cần mang ô/dù — \"umbrella\". \"Sunglasses\" (kính râm) dùng khi trời nắng, \"wallet\" (ví tiền) và \"camera\" (máy ảnh) không liên quan đến thời tiết."
    },
    {
      "level": "A1",
      "skill": "reading",
      "question": "Hello! My name is Yuki. I am from Japan, but I live in Hanoi now. I teach Japanese at a small language school near West Lake.\n\nWhat is Yuki's job?",
      "options": [
        "A student",
        "A cook",
        "A doctor",
        "A teacher"
      ],
      "answer": 3,
      "explain_vi": "Đoạn văn viết \"I teach Japanese at a small language school\" — Yuki dạy tiếng Nhật, tức là giáo viên (a teacher). Các nghề còn lại (học sinh, đầu bếp, bác sĩ) không được nhắc đến trong đoạn."
    },
    {
      "level": "A2",
      "skill": "grammar",
      "question": "Last weekend, Lan and her friends ___ to Vung Tau by bus.",
      "options": [
        "went",
        "go",
        "have gone",
        "goed"
      ],
      "answer": 0,
      "explain_vi": "\"Last weekend\" là mốc thời gian quá khứ xác định nên dùng quá khứ đơn; \"go\" là động từ bất quy tắc → \"went\". \"Go\" không chia thì là lỗi phổ biến của người Việt; \"have gone\" (hiện tại hoàn thành) sai vì đã có mốc thời gian quá khứ cụ thể; \"goed\" là dạng chia sai vì go không thêm -ed."
    },
    {
      "level": "A2",
      "skill": "grammar",
      "question": "This new phone is much ___ than my old one.",
      "options": [
        "cheap",
        "more cheap",
        "cheaper",
        "cheapest"
      ],
      "answer": 2,
      "explain_vi": "So sánh hơn với tính từ ngắn: thêm -er → \"cheaper than\". \"More cheap\" là lỗi kinh điển do dịch từ \"rẻ hơn\" (more chỉ dùng với tính từ dài); \"cheap\" thiếu dạng so sánh dù có \"than\"; \"cheapest\" là so sánh nhất, cần \"the\" và không đi với \"than\"."
    },
    {
      "level": "A2",
      "skill": "grammar",
      "question": "Look at those dark clouds! It ___ rain soon.",
      "options": [
        "will",
        "rains",
        "going to",
        "is going to"
      ],
      "answer": 3,
      "explain_vi": "Dự đoán dựa trên dấu hiệu nhìn thấy được (mây đen) dùng \"be going to\" → \"is going to rain\". \"Going to\" thiếu động từ \"is\" là lỗi rất hay gặp; \"will\" dùng cho dự đoán không có căn cứ hoặc quyết định tức thời; \"rains\" là hiện tại đơn, không diễn tả dự đoán tương lai ở đây."
    },
    {
      "level": "A2",
      "skill": "vocabulary",
      "question": "Sarah is very good ___ cooking Vietnamese food.",
      "options": [
        "in",
        "at",
        "on",
        "with"
      ],
      "answer": 1,
      "explain_vi": "Cụm cố định là \"good at + V-ing\" (giỏi về việc gì). \"Good in\" là lỗi dịch từ \"giỏi trong/về\" của người Việt; \"on\" và \"with\" không đi với \"good\" trong nghĩa này."
    },
    {
      "level": "A2",
      "skill": "vocabulary",
      "question": "I woke up late this morning and ___ the first bus to school.",
      "options": [
        "lost",
        "failed",
        "missed",
        "passed"
      ],
      "answer": 2,
      "explain_vi": "\"Miss\" nghĩa là lỡ (xe, chuyến bay, cuộc họp) → \"missed the bus\". \"Lost\" là làm mất đồ vật — bẫy vì tiếng Việt đều nói \"lỡ/mất\"; \"failed\" là trượt (kỳ thi); \"passed\" là đỗ hoặc đi ngang qua, ngược nghĩa hoàn toàn."
    },
    {
      "level": "A2",
      "skill": "reading",
      "question": "Lan works at a coffee shop near her house. She starts work at seven in the morning and finishes at three in the afternoon. The shop closes on Sundays, so she usually goes swimming with her friends.\n\nWhat does Lan usually do on Sundays?",
      "options": [
        "She goes swimming",
        "She works at the coffee shop",
        "She opens the shop early",
        "She stays at home"
      ],
      "answer": 0,
      "explain_vi": "Câu cuối nói rõ: chủ nhật quán đóng cửa nên Lan \"usually goes swimming with her friends\". Cô ấy không làm việc hay mở quán vào chủ nhật (quán đóng cửa), và đoạn văn không nói cô ấy ở nhà."
    },
    {
      "level": "B1",
      "skill": "grammar",
      "question": "Minh and I ___ each other since we were at university.",
      "options": [
        "knew",
        "are knowing",
        "have known",
        "know"
      ],
      "answer": 2,
      "explain_vi": "\"Since + mốc quá khứ\" báo hiệu hành động kéo dài từ quá khứ đến hiện tại → hiện tại hoàn thành \"have known\". \"Knew\" (quá khứ đơn) sai vì tình bạn vẫn tiếp diễn — lỗi người Việt hay mắc khi dịch \"đã quen\"; \"know\" không thể hiện sự kéo dài với since; \"are knowing\" sai vì know là động từ trạng thái, không dùng tiếp diễn."
    },
    {
      "level": "B1",
      "skill": "grammar",
      "question": "If I ___ more free time, I would learn to play the guitar.",
      "options": [
        "have",
        "had",
        "would have",
        "will have"
      ],
      "answer": 1,
      "explain_vi": "Vế sau có \"would learn\" → câu điều kiện loại 2 (giả định trái với hiện tại): If + quá khứ đơn → \"had\". \"Have\" thuộc điều kiện loại 1 (phải đi với will ở vế sau); \"would have\" không đứng trong mệnh đề if; \"will have\" vi phạm quy tắc không dùng will trong mệnh đề if."
    },
    {
      "level": "B1",
      "skill": "grammar",
      "question": "This bridge ___ over fifty years ago by French engineers.",
      "options": [
        "was built",
        "built",
        "has been built",
        "was building"
      ],
      "answer": 0,
      "explain_vi": "Cây cầu là vật chịu tác động (có \"by French engineers\") → bị động quá khứ đơn: \"was built\". \"Built\" là chủ động, thiếu \"was\" — lỗi bỏ to be trong câu bị động rất phổ biến; \"has been built\" sai vì có mốc \"fifty years ago\"; \"was building\" là quá khứ tiếp diễn chủ động, vô lý vì cầu không tự xây."
    },
    {
      "level": "B1",
      "skill": "vocabulary",
      "question": "The doctor gave me a ___ for antibiotics and told me to rest for three days.",
      "options": [
        "recipe",
        "receipt",
        "description",
        "prescription"
      ],
      "answer": 3,
      "explain_vi": "\"Prescription\" là đơn thuốc do bác sĩ kê. \"Recipe\" là công thức nấu ăn, \"receipt\" là hóa đơn/biên lai — bộ ba này người Việt cực hay nhầm vì na ná nhau; \"description\" là bản mô tả, không liên quan đến thuốc."
    },
    {
      "level": "B1",
      "skill": "vocabulary",
      "question": "The meeting has been ___ until next Friday because the director is ill.",
      "options": [
        "put on",
        "put off",
        "taken off",
        "turned off"
      ],
      "answer": 1,
      "explain_vi": "\"Put off\" là cụm động từ nghĩa hoãn lại (= postpone), hợp với \"until next Friday\". \"Put on\" là mặc (quần áo), \"taken off\" là cởi ra/cất cánh, \"turned off\" là tắt (thiết bị) — các cụm với tiểu từ khác nhau mang nghĩa hoàn toàn khác nhau."
    },
    {
      "level": "B1",
      "skill": "reading",
      "question": "More and more young people in big cities are choosing to cycle to work instead of driving. Cycling is cheaper, better for their health, and often faster during rush hour. However, many cyclists say that their cities still need safer bike lanes.\n\nWhat is the main idea of the passage?",
      "options": [
        "Driving is always faster than cycling",
        "Young people cannot afford to buy cars",
        "Cities have already built enough bike lanes",
        "Cycling to work is becoming popular, but safety is still a concern"
      ],
      "answer": 3,
      "explain_vi": "Đoạn văn nêu xu hướng đi xe đạp đi làm ngày càng phổ biến kèm lợi ích, rồi kết bằng lo ngại về làn đường an toàn — đúng với đáp án. Các lựa chọn khác đều trái với nội dung: bài nói đạp xe thường nhanh hơn giờ cao điểm, không nói người trẻ thiếu tiền mua ô tô, và làn đường xe đạp còn thiếu chứ không phải đã đủ."
    },
    {
      "level": "B2",
      "skill": "grammar",
      "question": "If Tom ___ harder last semester, he would have passed the final exam.",
      "options": [
        "studied",
        "has studied",
        "had studied",
        "would study"
      ],
      "answer": 2,
      "explain_vi": "Vế sau \"would have passed\" cho biết đây là điều kiện loại 3 (giả định trái với quá khứ): If + quá khứ hoàn thành → \"had studied\". \"Studied\" thuộc điều kiện loại 2 (vế sau phải là would + V); \"has studied\" là hiện tại hoàn thành, không dùng trong câu điều kiện này; \"would study\" không bao giờ đứng trong mệnh đề if."
    },
    {
      "level": "B2",
      "skill": "grammar",
      "question": "___ had I arrived at the office when the fire alarm went off.",
      "options": [
        "No sooner",
        "Hardly",
        "Only when",
        "Not until"
      ],
      "answer": 1,
      "explain_vi": "Cấu trúc đảo ngữ \"Hardly + had + S + PII ... when ...\" (vừa mới... thì...). \"No sooner\" là bẫy kinh điển vì phải đi với \"than\" chứ không phải \"when\"; \"Only when\" và \"Not until\" đảo ngữ ở mệnh đề chính chứ không đứng trước \"had I arrived\" theo nghĩa này."
    },
    {
      "level": "B2",
      "skill": "grammar",
      "question": "Lan had her laptop ___ at the shop yesterday because it wouldn't start.",
      "options": [
        "repair",
        "to repair",
        "repaired",
        "repairing"
      ],
      "answer": 2,
      "explain_vi": "Cấu trúc nhờ/thuê người khác làm (causative): \"have + vật + PII\" → \"had her laptop repaired\" (laptop được sửa bởi cửa hàng). \"Repair\" (nguyên mẫu) chỉ dùng khi tân ngữ là người tự làm (have someone repair); \"to repair\" và \"repairing\" đều sai dạng trong cấu trúc này."
    },
    {
      "level": "B2",
      "skill": "vocabulary",
      "question": "The new tax policy is expected to have a significant ___ on small businesses.",
      "options": [
        "impact",
        "affection",
        "consequence",
        "emphasis"
      ],
      "answer": 0,
      "explain_vi": "Collocation học thuật chuẩn là \"have a significant impact on\" (tác động đáng kể đến). \"Affection\" nghĩa là tình cảm yêu mến — bẫy do nhầm với động từ \"affect\"; \"consequence\" thường dùng \"have consequences for\"; \"emphasis\" đi với \"place/put emphasis on\", không đi với \"have ... on\"."
    },
    {
      "level": "B2",
      "skill": "vocabulary",
      "question": "The research team ___ a series of experiments to test their hypothesis.",
      "options": [
        "made",
        "held",
        "invented",
        "conducted"
      ],
      "answer": 3,
      "explain_vi": "Collocation học thuật đúng là \"conduct experiments\" (tiến hành thí nghiệm). \"Made\" là bẫy do dịch thẳng từ \"làm thí nghiệm\"; \"held\" đi với sự kiện, cuộc họp (hold a meeting); \"invented\" nghĩa là phát minh ra thứ mới, không hợp nghĩa ở đây."
    },
    {
      "level": "B2",
      "skill": "reading",
      "question": "Remote work, once considered a rare privilege, has become standard practice in many industries. While employees generally report higher job satisfaction and better work-life balance, some managers worry that long-term remote arrangements may weaken company culture and make it harder to train junior staff. As a result, many firms are adopting hybrid models as a compromise.\n\nWhat can be inferred from the passage?",
      "options": [
        "Hybrid models are an attempt to balance the benefits and drawbacks of remote work",
        "Most employees dislike working from home",
        "Remote work has completely replaced office work in every industry",
        "Junior staff learn faster when they work remotely"
      ],
      "answer": 0,
      "explain_vi": "Đoạn văn nêu lợi ích (nhân viên hài lòng hơn) lẫn lo ngại (văn hóa công ty, đào tạo nhân viên mới), rồi kết luận nhiều công ty chọn mô hình hybrid \"as a compromise\" — tức là để cân bằng hai mặt. Các lựa chọn khác trái với bài: nhân viên nhìn chung hài lòng hơn chứ không ghét làm từ xa, remote chỉ phổ biến ở \"nhiều ngành\" chứ chưa thay thế hoàn toàn, và bài ngụ ý nhân viên mới khó được đào tạo hơn khi làm từ xa."
    },
    {
      "level": "A1",
      "skill": "grammar",
      "question": "There ___ two big supermarkets near my grandmother's house.",
      "options": [
        "is",
        "has",
        "are",
        "have"
      ],
      "answer": 2,
      "explain_vi": "Sau 'There' với danh từ số nhiều (two big supermarkets) phải dùng 'are'. Người Việt hay dịch 'có' thành 'have', nhưng cấu trúc đúng trong tiếng Anh là 'There are'."
    },
    {
      "level": "A1",
      "skill": "grammar",
      "question": "Nga's birthday party is ___ Saturday evening.",
      "options": [
        "on",
        "in",
        "at",
        "from"
      ],
      "answer": 0,
      "explain_vi": "Trước thứ trong tuần hoặc thứ kèm buổi (Saturday evening) dùng giới từ 'on'. 'In' dùng cho tháng/năm/buổi nói chung, 'at' dùng cho giờ cụ thể."
    },
    {
      "level": "A1",
      "skill": "grammar",
      "question": "I can't talk on the phone now. I ___ dinner for my family.",
      "options": [
        "cook",
        "am cooking",
        "cooking",
        "cooks"
      ],
      "answer": 1,
      "explain_vi": "Hành động đang diễn ra ngay lúc nói dùng thì hiện tại tiếp diễn: am/is/are + V-ing. Lỗi thường gặp là bỏ mất 'am' và chỉ viết 'cooking'."
    },
    {
      "level": "A1",
      "skill": "vocabulary",
      "question": "Mai can't see the board at school very well, so she wears ___.",
      "options": [
        "gloves",
        "shoes",
        "earrings",
        "glasses"
      ],
      "answer": 3,
      "explain_vi": "'Glasses' là kính đeo mắt, giúp nhìn rõ hơn. Cẩn thận nhầm với 'gloves' (găng tay) vì hai từ viết khá giống nhau."
    },
    {
      "level": "A1",
      "skill": "vocabulary",
      "question": "Every Sunday morning, my mother buys fruit and vegetables at the ___.",
      "options": [
        "market",
        "cinema",
        "library",
        "airport"
      ],
      "answer": 0,
      "explain_vi": "'Market' là chợ, nơi mua rau củ và trái cây. 'Cinema' là rạp chiếu phim, 'library' là thư viện, 'airport' là sân bay — đều không phải nơi mua thực phẩm."
    },
    {
      "level": "A1",
      "skill": "reading",
      "question": "Bo is my little dog. He is white with black ears. He loves to run in the park and play with his red ball. At night, he sleeps in a small bed next to mine.\n\nWhat does Bo love to do?",
      "options": [
        "Sleep in the park",
        "Eat in the kitchen",
        "Run and play with his ball",
        "Swim in the river"
      ],
      "answer": 2,
      "explain_vi": "Bài đọc nói 'He loves to run in the park and play with his red ball' — chú chó Bo thích chạy trong công viên và chơi với quả bóng. Ban đêm Bo ngủ trong giường nhỏ, không phải ngủ ở công viên."
    },
    {
      "level": "A2",
      "skill": "grammar",
      "question": "How ___ sugar do you want in your lemon tea?",
      "options": [
        "many",
        "much",
        "a few",
        "a lot"
      ],
      "answer": 1,
      "explain_vi": "'Sugar' là danh từ không đếm được nên dùng 'much' trong câu hỏi 'How much...'. 'Many' và 'a few' chỉ đi với danh từ đếm được số nhiều."
    },
    {
      "level": "A2",
      "skill": "grammar",
      "question": "Hoa went to the post office ___ some stamps for her collection.",
      "options": [
        "for buy",
        "buying",
        "for to buy",
        "to buy"
      ],
      "answer": 3,
      "explain_vi": "Diễn tả mục đích dùng 'to + động từ nguyên mẫu' (to buy = để mua). Lỗi phổ biến là dịch 'để mua' thành 'for buy' hoặc 'for to buy' — cả hai đều sai ngữ pháp."
    },
    {
      "level": "A2",
      "skill": "grammar",
      "question": "My grandfather ___ live in Hue, but now he lives with us in Saigon.",
      "options": [
        "used to",
        "is used to",
        "uses to",
        "was used to"
      ],
      "answer": 0,
      "explain_vi": "'Used to + động từ nguyên mẫu' diễn tả thói quen hoặc tình trạng trong quá khứ mà nay không còn. 'Be used to + V-ing' lại nghĩa là 'quen với việc gì' nên không hợp ở đây."
    },
    {
      "level": "A2",
      "skill": "vocabulary",
      "question": "Bao wants a new motorbike, so he tries to ___ a little money every month.",
      "options": [
        "spend",
        "waste",
        "save",
        "pay"
      ],
      "answer": 2,
      "explain_vi": "'Save money' là để dành, tiết kiệm tiền. 'Spend' là tiêu tiền, 'waste' là lãng phí, 'pay' là trả tiền — đều ngược với mục đích dành tiền mua xe."
    },
    {
      "level": "A2",
      "skill": "vocabulary",
      "question": "I left my pen at home. Can I ___ yours for a minute?",
      "options": [
        "lend",
        "borrow",
        "return",
        "sell"
      ],
      "answer": 1,
      "explain_vi": "'Borrow' là mượn (mình nhận đồ từ người khác), còn 'lend' là cho mượn (mình đưa đồ cho người khác). Người nói đang xin mượn bút nên dùng 'borrow'. Đây là cặp từ người Việt rất hay nhầm."
    },
    {
      "level": "A2",
      "skill": "reading",
      "question": "Emma is visiting Hoi An with her family this week. Yesterday they walked around the old town and tried some local food. Tomorrow they will take a boat trip on the river before going home.\n\nWhat will Emma's family do tomorrow?",
      "options": [
        "Walk around the old town",
        "Eat local food",
        "Visit a museum",
        "Take a boat trip on the river"
      ],
      "answer": 3,
      "explain_vi": "Câu 'Tomorrow they will take a boat trip on the river' cho biết ngày mai cả nhà sẽ đi thuyền trên sông. Đi dạo phố cổ và thử món ăn địa phương là việc đã làm hôm qua."
    },
    {
      "level": "B1",
      "skill": "grammar",
      "question": "Nga told me that she ___ tired and wanted to go home early.",
      "options": [
        "was",
        "is",
        "has been",
        "be"
      ],
      "answer": 0,
      "explain_vi": "Trong câu tường thuật với động từ tường thuật ở quá khứ (told), thì hiện tại phải lùi về quá khứ: 'is' đổi thành 'was'. Động từ 'wanted' ở vế sau cũng xác nhận cả câu ở thì quá khứ."
    },
    {
      "level": "B1",
      "skill": "grammar",
      "question": "The woman ___ lives next door to us is a famous chef on television.",
      "options": [
        "which",
        "whom",
        "who",
        "whose"
      ],
      "answer": 2,
      "explain_vi": "Đại từ quan hệ thay cho người và làm chủ ngữ của mệnh đề (đứng trước động từ 'lives') là 'who'. 'Which' dùng cho vật, 'whom' chỉ làm tân ngữ, 'whose' chỉ sở hữu."
    },
    {
      "level": "B1",
      "skill": "grammar",
      "question": "You'll miss the last train ___ you leave the office right now.",
      "options": [
        "if",
        "when",
        "until",
        "unless"
      ],
      "answer": 3,
      "explain_vi": "'Unless' nghĩa là 'trừ khi': bạn sẽ lỡ chuyến tàu cuối trừ khi đi ngay bây giờ. Dùng 'if' sẽ tạo nghĩa vô lý (đi ngay mà vẫn lỡ tàu), nên 'unless' là lựa chọn hợp lý duy nhất."
    },
    {
      "level": "B1",
      "skill": "vocabulary",
      "question": "Our flight finally ___ off three hours late because of the heavy storm.",
      "options": [
        "turned",
        "took",
        "put",
        "got"
      ],
      "answer": 1,
      "explain_vi": "'Take off' là cụm động từ nghĩa là (máy bay) cất cánh. 'Turn off' là tắt thiết bị, 'put off' là trì hoãn, 'get off' là xuống xe — đều không dùng cho máy bay cất cánh."
    },
    {
      "level": "B1",
      "skill": "vocabulary",
      "question": "David applied for the ___ of sales manager at a large electronics company.",
      "options": [
        "position",
        "work",
        "career",
        "salary"
      ],
      "answer": 0,
      "explain_vi": "'Position' là vị trí/chức vụ cụ thể, đi với cụm 'apply for the position of'. 'Work' là công việc nói chung (không đếm được), 'career' là sự nghiệp lâu dài, 'salary' là tiền lương."
    },
    {
      "level": "B1",
      "skill": "reading",
      "question": "Many university students in Vietnam now take part-time jobs while they study. The extra money helps them pay for books, food, and travel. However, some teachers worry that students who work long hours have less time and energy for their lessons.\n\nWhy are some teachers worried?",
      "options": [
        "Because students earn too much money",
        "Because part-time jobs are hard to find",
        "Because working long hours leaves students less time to study",
        "Because universities do not allow part-time jobs"
      ],
      "answer": 2,
      "explain_vi": "Bài đọc nói giáo viên lo rằng sinh viên làm việc nhiều giờ sẽ 'have less time and energy for their lessons' — tức là còn ít thời gian và sức lực cho việc học."
    },
    {
      "level": "B2",
      "skill": "grammar",
      "question": "I wish I ___ more attention in my French classes at school — I can hardly remember a word now.",
      "options": [
        "paid",
        "have paid",
        "would pay",
        "had paid"
      ],
      "answer": 3,
      "explain_vi": "'Wish' + quá khứ hoàn thành (had + V3) diễn tả sự tiếc nuối về điều đã không làm trong quá khứ. Quá khứ đơn ('paid') chỉ dùng khi ước điều trái với hiện tại, không phải quá khứ."
    },
    {
      "level": "B2",
      "skill": "grammar",
      "question": "___ by the sudden thunder, the cat leapt off the bookshelf and hid under the sofa.",
      "options": [
        "Frightened",
        "Frightening",
        "To frighten",
        "Frighten"
      ],
      "answer": 0,
      "explain_vi": "Mệnh đề rút gọn mang nghĩa bị động dùng quá khứ phân từ: con mèo 'bị' tiếng sấm làm cho sợ nên dùng 'Frightened'. Dạng V-ing ('Frightening') mang nghĩa chủ động — tự gây sợ hãi cho thứ khác."
    },
    {
      "level": "B2",
      "skill": "grammar",
      "question": "Trang isn't answering any of my calls. She ___ her phone at home again.",
      "options": [
        "must leave",
        "must have left",
        "should have left",
        "can't have left"
      ],
      "answer": 1,
      "explain_vi": "Suy đoán gần như chắc chắn về một việc trong quá khứ dùng 'must have + V3'. 'Should have left' mang nghĩa trách móc (lẽ ra nên), 'can't have left' là suy đoán phủ định — đều sai nghĩa trong ngữ cảnh này."
    },
    {
      "level": "B2",
      "skill": "vocabulary",
      "question": "The design team worked through the night to ___ the deadline for the advertising campaign.",
      "options": [
        "catch",
        "reach",
        "meet",
        "arrive"
      ],
      "answer": 2,
      "explain_vi": "'Meet a deadline' là cụm cố định nghĩa là hoàn thành công việc đúng hạn. Người Việt hay dịch 'kịp deadline' thành 'catch' hoặc 'reach', nhưng tiếng Anh chuẩn dùng 'meet'."
    },
    {
      "level": "B2",
      "skill": "vocabulary",
      "question": "After weeks of public criticism, the company director finally agreed to ___ down and let someone else take over.",
      "options": [
        "fall",
        "get",
        "look",
        "step"
      ],
      "answer": 3,
      "explain_vi": "'Step down' là cụm động từ nghĩa là từ chức, rời khỏi vị trí lãnh đạo. 'Fall down' là ngã, 'get down' là cúi xuống, 'look down' là nhìn xuống hoặc coi thường — không từ nào mang nghĩa từ chức."
    },
    {
      "level": "B2",
      "skill": "reading",
      "question": "Although electric cars produce no exhaust fumes on the road, critics argue that they are not as green as they appear. The electricity that charges them often comes from coal-fired power stations, and mining the metals for their batteries damages the environment. Supporters reply that, even so, electric cars pollute far less than petrol cars over their whole lifetime.\n\nWhat point do the critics make?",
      "options": [
        "Electric cars produce more exhaust fumes than petrol cars",
        "Producing and charging electric cars can still harm the environment",
        "Electric cars are too expensive for most drivers",
        "Petrol cars will soon disappear from the roads"
      ],
      "answer": 1,
      "explain_vi": "Người phản đối chỉ ra rằng điện sạc xe thường đến từ nhà máy nhiệt điện than và việc khai thác kim loại làm pin gây hại môi trường — tức là xe điện vẫn gián tiếp gây ô nhiễm."
    }
  ]
};
