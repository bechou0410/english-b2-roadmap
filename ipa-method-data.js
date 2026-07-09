// Dữ liệu 44 âm IPA (mẹo cho người Việt), bộ cặp âm tối thiểu và bài phương pháp học.
window.IPA_METHOD = {
  "vowels": [
    {
      "symbol": "iː",
      "label_vi": "i dài (căng)",
      "examples": [
        {
          "word": "see",
          "ipa": "/siː/"
        },
        {
          "word": "eat",
          "ipa": "/iːt/"
        },
        {
          "word": "need",
          "ipa": "/niːd/"
        }
      ],
      "tip_vi": "Kéo hai khóe môi sang ngang như đang mỉm cười, lưỡi nâng cao về phía trước, cơ miệng CĂNG. Giữ âm dài khoảng 2 nhịp, đừng cắt cụt.",
      "vn_mistake_vi": "Hay đọc ngắn như chữ 'i' tiếng Việt, làm 'sheep' nghe thành 'ship'. Tự kiểm: ghi âm cặp sheep/ship — nếu hai từ nghe giống nhau là bạn đang đọc thiếu độ dài và độ căng."
    },
    {
      "symbol": "ɪ",
      "label_vi": "i ngắn (lỏng)",
      "examples": [
        {
          "word": "sit",
          "ipa": "/sɪt/"
        },
        {
          "word": "big",
          "ipa": "/bɪɡ/"
        },
        {
          "word": "fish",
          "ipa": "/fɪʃ/"
        }
      ],
      "tip_vi": "Miệng thả lỏng, lưỡi hạ thấp và lùi về sau hơn /iː/ một chút — âm nằm giữa 'i' và 'ê' tiếng Việt. Phát ngắn, dứt khoát, KHÔNG kéo dài.",
      "vn_mistake_vi": "Hay đọc căng và dài như 'i' tiếng Việt, làm 'ship' nghe thành 'sheep', 'live' thành 'leave'. Tự kiểm: nói 'sit' thật nhanh với miệng lười — nếu môi bạn đang cười căng là sai."
    },
    {
      "symbol": "e",
      "label_vi": "e mở",
      "examples": [
        {
          "word": "bed",
          "ipa": "/bed/"
        },
        {
          "word": "red",
          "ipa": "/red/"
        },
        {
          "word": "ten",
          "ipa": "/ten/"
        }
      ],
      "tip_vi": "Gần giống 'e' tiếng Việt nhưng hàm dưới hạ xuống hơn một chút, lưỡi ở phía trước, giữa độ cao. Âm ngắn, gọn.",
      "vn_mistake_vi": "Hay lẫn với /æ/ làm 'bed' và 'bad' nghe y hệt nhau, hoặc đọc quá khép thành 'ê' ('ten' thành 'tên'). Tự kiểm: đọc cặp bed/bad — miệng phải mở rộng hơn hẳn ở 'bad'."
    },
    {
      "symbol": "æ",
      "label_vi": "a bẹt (giữa a và e)",
      "examples": [
        {
          "word": "cat",
          "ipa": "/kæt/"
        },
        {
          "word": "bad",
          "ipa": "/bæd/"
        },
        {
          "word": "happy",
          "ipa": "/ˈhæpi/"
        }
      ],
      "tip_vi": "Mở miệng rộng như nói 'a' nhưng lưỡi đẩy về phía TRƯỚC và khóe miệng kéo ngang — nghe như 'a' và 'e' trộn vào nhau. Tiếng Việt không có âm này nên phải tập riêng.",
      "vn_mistake_vi": "Hay đọc thành 'e' ('bad' thành 'bed') hoặc 'a' ('cat' thành 'cát'). Tự kiểm: soi gương khi nói 'cat' — hàm dưới phải hạ thấp rõ rệt, thấy được nhiều răng dưới."
    },
    {
      "symbol": "ɑː",
      "label_vi": "a dài (mở họng)",
      "examples": [
        {
          "word": "father",
          "ipa": "/ˈfɑːðər/"
        },
        {
          "word": "car",
          "ipa": "/kɑːr/"
        },
        {
          "word": "start",
          "ipa": "/stɑːrt/"
        }
      ],
      "tip_vi": "Mở họng rộng như khi bác sĩ khám họng bảo nói 'aaa', lưỡi hạ thấp và lùi về sau, môi không tròn. Giọng Mỹ đọc rõ âm r phía sau: 'car' có r cong lưỡi ở cuối.",
      "vn_mistake_vi": "Hay đọc ngắn như 'a' tiếng Việt và nuốt mất r cuối — 'car' thành 'ca', 'start' thành 'sờ-tát'. Tự kiểm: giữ âm 'a' đủ 2 nhịp rồi cong đầu lưỡi lên cho ra tiếng r."
    },
    {
      "symbol": "ɒ",
      "label_vi": "o ngắn (kiểu Anh)",
      "examples": [
        {
          "word": "hot",
          "ipa": "/hɒt/"
        },
        {
          "word": "stop",
          "ipa": "/stɒp/"
        },
        {
          "word": "job",
          "ipa": "/dʒɒb/"
        }
      ],
      "tip_vi": "Trong giọng Mỹ, âm này gộp với /ɑː/: 'hot' đọc là /hɑːt/ — mở họng rộng, môi hầu như KHÔNG tròn (ký hiệu ɒ giữ theo từ điển Anh-Anh). Cứ nghĩ nó là 'a' mở họng thay vì 'o'.",
      "vn_mistake_vi": "Hay tròn môi thành 'o' tiếng Việt — 'hot' thành 'hót', 'job' thành 'giốp'. Tự kiểm: đặt ngón tay chạm nhẹ hai bên môi khi nói 'stop' — nếu môi chụm tròn chạm vào tay là đang đọc kiểu tiếng Việt."
    },
    {
      "symbol": "ɔː",
      "label_vi": "o dài",
      "examples": [
        {
          "word": "call",
          "ipa": "/kɔːl/"
        },
        {
          "word": "saw",
          "ipa": "/sɔː/"
        },
        {
          "word": "talk",
          "ipa": "/tɔːk/"
        }
      ],
      "tip_vi": "Tròn môi vừa phải (ít hơn 'ô' tiếng Việt), lưỡi lùi về sau, giữ âm dài. Nhiều người Mỹ đọc gần như /ɑː/ luôn — bạn tròn môi nhẹ và kéo dài là an toàn nhất.",
      "vn_mistake_vi": "Hay đọc ngắn cụt như 'o' tiếng Việt và bỏ phụ âm cuối — 'call' thành 'co', 'talk' thành 'tót'. Tự kiểm: 'call' phải kết thúc bằng đầu lưỡi chạm lợi trên (âm l), và nguyên âm ngân đủ 2 nhịp."
    },
    {
      "symbol": "ʊ",
      "label_vi": "u ngắn (lỏng)",
      "examples": [
        {
          "word": "book",
          "ipa": "/bʊk/"
        },
        {
          "word": "good",
          "ipa": "/ɡʊd/"
        },
        {
          "word": "put",
          "ipa": "/pʊt/"
        }
      ],
      "tip_vi": "Môi chỉ hơi tròn, thả lỏng hoàn toàn, lưỡi lùi nhẹ về sau — như chuẩn bị nói 'u' nhưng lười, không chu môi hẳn. Âm rất ngắn.",
      "vn_mistake_vi": "Hay chu môi căng và kéo dài như 'u' tiếng Việt, làm 'full' nghe thành 'fool', 'pull' thành 'pool'. Tự kiểm: nói 'book' thật nhanh — nếu môi bạn chu ra như huýt sáo là sai."
    },
    {
      "symbol": "uː",
      "label_vi": "u dài (căng)",
      "examples": [
        {
          "word": "food",
          "ipa": "/fuːd/"
        },
        {
          "word": "blue",
          "ipa": "/bluː/"
        },
        {
          "word": "school",
          "ipa": "/skuːl/"
        }
      ],
      "tip_vi": "Chu môi tròn và căng như huýt sáo, lưỡi nâng cao phía sau, kéo dài âm khoảng 2 nhịp. Đây là phiên bản căng-dài của /ʊ/.",
      "vn_mistake_vi": "Hay đọc ngắn như 'u' tiếng Việt nên mất tương phản với /ʊ/ — 'fool' và 'full' nghe như nhau. Tự kiểm: ghi âm cặp pool/pull; 'pool' phải dài và môi chu rõ hơn hẳn."
    },
    {
      "symbol": "ʌ",
      "label_vi": "ă/ơ mở (âm bật)",
      "examples": [
        {
          "word": "cup",
          "ipa": "/kʌp/"
        },
        {
          "word": "love",
          "ipa": "/lʌv/"
        },
        {
          "word": "money",
          "ipa": "/ˈmʌni/"
        }
      ],
      "tip_vi": "Miệng mở vừa, lưỡi nằm giữa và hơi hạ thấp, mọi thứ thả lỏng — rất gần âm 'ă' tiếng Việt nói nhanh (như trong 'ăn'). Ngắn và dứt khoát.",
      "vn_mistake_vi": "Hay đọc theo mặt chữ: 'cup' thành 'cúp', 'love' thành 'lốp', 'money' thành 'mô-ni'. Tự kiểm: đọc bộ ba but/boot/bot — 'but' phải nghe gần 'bặt' chứ không phải 'bút' hay 'bót'."
    },
    {
      "symbol": "ɜː",
      "label_vi": "ơ dài (cong lưỡi r)",
      "examples": [
        {
          "word": "bird",
          "ipa": "/bɜːrd/"
        },
        {
          "word": "work",
          "ipa": "/wɜːrk/"
        },
        {
          "word": "learn",
          "ipa": "/lɜːrn/"
        }
      ],
      "tip_vi": "Giọng Mỹ đọc âm này r-hóa hoàn toàn: nói 'ơ' nhưng cong nhẹ đầu lưỡi lên (không chạm vòm miệng) và giữ tư thế đó SUỐT cả âm, môi thả lỏng, kéo dài.",
      "vn_mistake_vi": "Hay đọc thành 'ơ' phẳng không có r — 'bird' thành 'bớt', 'work' thành 'guộc'. Tự kiểm: ngân âm này 3 giây, phải nghe tiếng r rền liên tục như tiếng máy, không phải 'ơ' trơn."
    },
    {
      "symbol": "ə",
      "label_vi": "ơ mờ (schwa — âm lười)",
      "examples": [
        {
          "word": "about",
          "ipa": "/əˈbaʊt/"
        },
        {
          "word": "banana",
          "ipa": "/bəˈnænə/"
        },
        {
          "word": "teacher",
          "ipa": "/ˈtiːtʃər/"
        }
      ],
      "tip_vi": "Âm lười nhất tiếng Anh: môi, lưỡi, hàm thả lỏng hoàn toàn, bật ra tiếng 'ơ' cực ngắn và nhẹ. Chỉ xuất hiện ở âm tiết KHÔNG có trọng âm — đây là âm phổ biến nhất tiếng Anh.",
      "vn_mistake_vi": "Hay đọc rõ mọi âm tiết theo mặt chữ vì tiếng Việt âm tiết nào cũng rõ — 'banana' thành 'ba-na-na' đều tăm tắp thay vì 'bơ-NE-nơ'. Tự kiểm: mỗi từ chỉ nhấn đúng 1 âm tiết, các âm tiết còn lại phải lướt nhanh và mờ."
    }
  ],
  "diphthongs": [
    {
      "symbol": "eɪ",
      "label_vi": "ây (trượt e → i)",
      "examples": [
        {
          "word": "day",
          "ipa": "/deɪ/"
        },
        {
          "word": "make",
          "ipa": "/meɪk/"
        },
        {
          "word": "rain",
          "ipa": "/reɪn/"
        }
      ],
      "tip_vi": "Bắt đầu ở âm 'e' rồi trượt dần lên 'i', hàm khép dần lại — giống 'ây' tiếng Việt nhưng trượt chậm hơn, nghe rõ hai chặng.",
      "vn_mistake_vi": "Hay đọc thành 'ê' phẳng một chặng — 'make' thành 'mếch', 'day' thành 'đê'. Tự kiểm: đặt tay dưới cằm khi nói 'day', phải cảm nhận cằm nâng lên khi âm trượt về 'i'."
    },
    {
      "symbol": "aɪ",
      "label_vi": "ai",
      "examples": [
        {
          "word": "time",
          "ipa": "/taɪm/"
        },
        {
          "word": "my",
          "ipa": "/maɪ/"
        },
        {
          "word": "like",
          "ipa": "/laɪk/"
        }
      ],
      "tip_vi": "Mở miệng rộng ở 'a' rồi trượt lên 'i', hàm khép dần — gần giống 'ai' tiếng Việt nên đây là âm dễ, chỉ cần trượt đủ chậm.",
      "vn_mistake_vi": "Nguyên âm thì ổn nhưng hay nuốt phụ âm cuối — 'like' thành 'lai', 'time' thành 'tai'. Tự kiểm: nói 'like' và bắt buộc phải nghe tiếng /k/ bật ra ở cuối."
    },
    {
      "symbol": "ɔɪ",
      "label_vi": "oi",
      "examples": [
        {
          "word": "boy",
          "ipa": "/bɔɪ/"
        },
        {
          "word": "enjoy",
          "ipa": "/ɪnˈdʒɔɪ/"
        },
        {
          "word": "voice",
          "ipa": "/vɔɪs/"
        }
      ],
      "tip_vi": "Tròn môi ở 'o' rồi trượt sang 'i', môi từ tròn chuyển sang bẹt — giống 'oi' tiếng Việt nhưng điểm xuất phát tròn môi và ngân dài hơn.",
      "vn_mistake_vi": "Hay đọc gọn lỏn thành 'oi' ngắn kiểu tiếng Việt và bỏ phụ âm cuối — 'voice' thành 'voi'. Tự kiểm: 'boy' phải nghe rõ hai chặng o-i, và 'voice' phải kết thúc bằng tiếng gió /s/."
    },
    {
      "symbol": "aʊ",
      "label_vi": "ao",
      "examples": [
        {
          "word": "now",
          "ipa": "/naʊ/"
        },
        {
          "word": "house",
          "ipa": "/haʊs/"
        },
        {
          "word": "down",
          "ipa": "/daʊn/"
        }
      ],
      "tip_vi": "Mở miệng rộng ở 'a' rồi tròn dần môi trượt về 'u' — giống 'ao' tiếng Việt nhưng kết thúc phải chu môi rõ hơn.",
      "vn_mistake_vi": "Hay đọc nhanh thành 'ao' cụt và nuốt phụ âm cuối — 'house' thành 'hao', 'down' thành 'đao'. Tự kiểm: cuối âm môi phải chu ra, và 'house' phải có /s/, 'down' phải có /n/ đóng lại."
    },
    {
      "symbol": "oʊ",
      "label_vi": "âu (ô trượt về u)",
      "examples": [
        {
          "word": "go",
          "ipa": "/ɡoʊ/"
        },
        {
          "word": "home",
          "ipa": "/hoʊm/"
        },
        {
          "word": "know",
          "ipa": "/noʊ/"
        }
      ],
      "tip_vi": "Giọng Mỹ dùng /oʊ/ (Anh-Anh ghi /əʊ/): bắt đầu ở 'ô' rồi chu môi trượt dần về 'u'. Đừng dừng lại ở 'ô' — phải có đoạn trượt.",
      "vn_mistake_vi": "Hay đọc thành 'ô' phẳng một chặng — 'go' thành 'gô', 'no' thành 'nô'. Tự kiểm: soi gương nói 'go', môi phải chu thêm về cuối âm; nếu môi đứng yên là đang đọc kiểu tiếng Việt."
    },
    {
      "symbol": "ɪə",
      "label_vi": "ia (i trượt về ơ)",
      "examples": [
        {
          "word": "near",
          "ipa": "/nɪər/"
        },
        {
          "word": "here",
          "ipa": "/hɪər/"
        },
        {
          "word": "idea",
          "ipa": "/aɪˈdiːə/"
        }
      ],
      "tip_vi": "Bắt đầu ở 'i' lỏng rồi trượt về 'ơ'. Giọng Mỹ thường đọc thành /ɪr/: 'near' ≈ 'ni' + r cong lưỡi — cứ kết thúc bằng r là chuẩn Mỹ (riêng 'idea' không có r).",
      "vn_mistake_vi": "Hay đọc thành 'ia' tiếng Việt và bỏ mất r — 'near' thành 'nia', 'here' thành 'hia'. Tự kiểm: cuối từ 'near' phải nghe tiếng r rền do đầu lưỡi cong lên."
    },
    {
      "symbol": "eə",
      "label_vi": "e-ơ (e trượt về ơ)",
      "examples": [
        {
          "word": "hair",
          "ipa": "/heər/"
        },
        {
          "word": "care",
          "ipa": "/keər/"
        },
        {
          "word": "there",
          "ipa": "/ðeər/"
        }
      ],
      "tip_vi": "Bắt đầu ở 'e' mở rồi trượt về 'ơ'. Giọng Mỹ đọc gọn thành /er/: 'care' ≈ 'khe' + r cong lưỡi giữ suốt phần cuối âm.",
      "vn_mistake_vi": "Hay đọc thành 'e' cụt không có r — 'hair' thành 'he', 'care' thành 'khe'. Tự kiểm: ngân phần cuối của 'hair' thêm 1 giây, phải nghe tiếng r liên tục chứ không phải im lặng."
    },
    {
      "symbol": "ʊə",
      "label_vi": "u-ơ (u trượt về ơ)",
      "examples": [
        {
          "word": "tour",
          "ipa": "/tʊər/"
        },
        {
          "word": "sure",
          "ipa": "/ʃʊər/"
        },
        {
          "word": "poor",
          "ipa": "/pʊər/"
        }
      ],
      "tip_vi": "Bắt đầu ở 'u' lỏng rồi trượt về 'ơ'. Giọng Mỹ đọc thành /ʊr/ hoặc gộp hẳn về /ɔːr/: 'sure' ≈ 'sur', 'poor' ≈ 'por' — luôn có r cong lưỡi ở cuối.",
      "vn_mistake_vi": "Hay đọc theo mặt chữ hoặc bỏ r — 'sure' thành 'su-re' hay 'sua', 'tour' thành 'tua'. Tự kiểm: nói 'tour' và giữ đầu lưỡi cong ở cuối; nếu kết thúc bằng 'a' mở như tiếng Việt là sai."
    }
  ],
  "consonants": [
    {
      "symbol": "p",
      "label_vi": "pờ bật hơi",
      "examples": [
        {
          "word": "pen",
          "ipa": "/pen/"
        },
        {
          "word": "happy",
          "ipa": "/ˈhæpi/"
        },
        {
          "word": "paper",
          "ipa": "/ˈpeɪpər/"
        }
      ],
      "tip_vi": "Mím chặt hai môi rồi bật hơi ra mạnh, ở đầu từ phải có luồng hơi rõ (giống thổi nến). Cuối từ vẫn khép môi lại dù không bật to.",
      "vn_mistake_vi": "Âm 'p' tiếng Việt không bật hơi nên 'pen' nghe thành 'ben', và 'stop' thường bị nuốt mất 'p' cuối. Tự kiểm tra: để tờ giấy mỏng trước miệng, nói 'pen' — giấy phải bay phất lên."
    },
    {
      "symbol": "b",
      "label_vi": "bờ môi rung",
      "examples": [
        {
          "word": "big",
          "ipa": "/bɪɡ/"
        },
        {
          "word": "baby",
          "ipa": "/ˈbeɪbi/"
        },
        {
          "word": "bag",
          "ipa": "/bæɡ/"
        }
      ],
      "tip_vi": "Giống 'b' tiếng Việt: mím hai môi, rung dây thanh rồi mở ra. Điểm khác là ở cuối từ ('job') môi vẫn phải khép lại để chốt âm.",
      "vn_mistake_vi": "Người Việt hay bỏ hẳn 'b' cuối từ ('job' thành 'chọ'). Tự kiểm tra: nói 'job' trước gương — kết thúc từ hai môi phải đang chạm nhau."
    },
    {
      "symbol": "t",
      "label_vi": "tờ bật hơi",
      "examples": [
        {
          "word": "time",
          "ipa": "/taɪm/"
        },
        {
          "word": "hotel",
          "ipa": "/hoʊˈtel/"
        },
        {
          "word": "cat",
          "ipa": "/kæt/"
        }
      ],
      "tip_vi": "Đầu lưỡi chạm vào lợi trên (không chạm răng), rồi bật hơi mạnh ra. Ở đầu từ, âm này gần với 'th' tiếng Việt hơn là 't' tiếng Việt. Riêng t ở GIỮA từ (water, better) giọng Mỹ thường đọc lướt thành âm gần 'đ' — đó là bình thường, không phải lỗi.",
      "vn_mistake_vi": "Hai lỗi: đọc như 't' tiếng Việt (không bật hơi) nên 'time' nghe như 'đai', và nuốt 't' cuối ('cat' thành 'ca'). Tự kiểm tra: nói 'cat' phải nghe một tiếng tách nhẹ ở cuối."
    },
    {
      "symbol": "d",
      "label_vi": "đờ (như 'đ' tiếng Việt)",
      "examples": [
        {
          "word": "dog",
          "ipa": "/dɔːɡ/"
        },
        {
          "word": "ready",
          "ipa": "/ˈredi/"
        },
        {
          "word": "good",
          "ipa": "/ɡʊd/"
        }
      ],
      "tip_vi": "Đầu lưỡi chạm lợi trên, rung dây thanh — chính là âm 'đ' tiếng Việt, không phải 'd' (dê). Cuối từ vẫn để lưỡi chạm lợi để chốt âm.",
      "vn_mistake_vi": "Chữ 'd' tiếng Anh dễ bị đọc thành 'd/gi' tiếng Việt ('dog' thành 'zọc'), và 'd' cuối hay bị bỏ ('good' thành 'gu'). Tự kiểm tra: kết thúc 'good' đầu lưỡi phải đang chạm lợi trên."
    },
    {
      "symbol": "k",
      "label_vi": "cờ bật hơi",
      "examples": [
        {
          "word": "key",
          "ipa": "/kiː/"
        },
        {
          "word": "school",
          "ipa": "/skuːl/"
        },
        {
          "word": "back",
          "ipa": "/bæk/"
        }
      ],
      "tip_vi": "Cuống lưỡi chạm vòm mềm phía sau rồi bật hơi ra mạnh — như 'c/k' tiếng Việt nhưng kèm luồng hơi rõ ở đầu từ.",
      "vn_mistake_vi": "'K' cuối hay bị nuốt sạch ('back' thành 'be', 'like' thành 'lai') — mà 'like' mất 'k' thì người nghe tưởng 'lie'. Tự kiểm tra: nói 'back', cuối từ phải cảm nhận cuống lưỡi chặn hơi rồi nhả nhẹ."
    },
    {
      "symbol": "ɡ",
      "label_vi": "gờ",
      "examples": [
        {
          "word": "go",
          "ipa": "/ɡoʊ/"
        },
        {
          "word": "again",
          "ipa": "/əˈɡen/"
        },
        {
          "word": "big",
          "ipa": "/bɪɡ/"
        }
      ],
      "tip_vi": "Cuống lưỡi chạm vòm mềm, rung dây thanh — giống 'g' tiếng Việt trong 'gà'. Cuối từ vẫn phải có động tác chặn hơi này.",
      "vn_mistake_vi": "'G' cuối thường bị bỏ ('big' thành 'bích' hoặc 'bi'). Mẹo phân biệt với /k/: trước /ɡ/ nguyên âm nghe dài hơn — so 'back' (ngắn) với 'bag' (dài). Tự kiểm tra bằng cách đọc cặp back/bag."
    },
    {
      "symbol": "f",
      "label_vi": "phờ",
      "examples": [
        {
          "word": "five",
          "ipa": "/faɪv/"
        },
        {
          "word": "coffee",
          "ipa": "/ˈkɔːfi/"
        },
        {
          "word": "life",
          "ipa": "/laɪf/"
        }
      ],
      "tip_vi": "Răng trên chạm nhẹ vào môi dưới, thổi hơi qua khe — chính là 'ph' tiếng Việt, giữ được bao lâu tùy thích.",
      "vn_mistake_vi": "Đầu từ thì ổn, nhưng /f/ cuối hay bị bỏ ('life' thành 'lai', 'knife' thành 'nai'). Tự kiểm tra: nói 'life' — cuối từ phải nghe tiếng gió xì nhẹ qua răng-môi."
    },
    {
      "symbol": "v",
      "label_vi": "vờ răng-môi rung",
      "examples": [
        {
          "word": "very",
          "ipa": "/ˈveri/"
        },
        {
          "word": "seven",
          "ipa": "/ˈsevn/"
        },
        {
          "word": "love",
          "ipa": "/lʌv/"
        }
      ],
      "tip_vi": "Khẩu hình y hệt /f/ (răng trên chạm môi dưới) nhưng rung dây thanh — nghe như tiếng xe máy 'vvv'.",
      "vn_mistake_vi": "Giọng miền Nam hay đọc 'v' thành 'd/gi' ('very' thành 'dery'), và /v/ cuối bị bỏ ('love' thành 'lơ'). Tự kiểm tra: môi dưới phải chạm răng trên, tay đặt lên cổ họng thấy rung."
    },
    {
      "symbol": "θ",
      "label_vi": "th lè lưỡi, không rung",
      "examples": [
        {
          "word": "think",
          "ipa": "/θɪŋk/"
        },
        {
          "word": "three",
          "ipa": "/θriː/"
        },
        {
          "word": "mouth",
          "ipa": "/maʊθ/"
        }
      ],
      "tip_vi": "Đưa đầu lưỡi ra giữa hai hàm răng (lè nhẹ, thấy được trong gương) rồi thổi hơi qua khe, không rung dây thanh. Ngại lè lưỡi thì chỉ cần lưỡi chạm mặt sau răng cửa trên là đủ.",
      "vn_mistake_vi": "Lỗi kinh điển: đọc thành 'th' tiếng Việt ('think' thành 'thing') hoặc /t/, /s/. Tự kiểm tra bằng gương: nói 'three' mà không thấy đầu lưỡi giữa hai hàm răng là đang sai."
    },
    {
      "symbol": "ð",
      "label_vi": "th lè lưỡi, có rung",
      "examples": [
        {
          "word": "this",
          "ipa": "/ðɪs/"
        },
        {
          "word": "mother",
          "ipa": "/ˈmʌðər/"
        },
        {
          "word": "breathe",
          "ipa": "/briːð/"
        }
      ],
      "tip_vi": "Vị trí lưỡi y hệt /θ/ (đầu lưỡi giữa hai hàm răng) nhưng rung dây thanh, nghe như tiếng ù trầm. Xuất hiện trong loạt từ siêu phổ biến: the, this, that, they.",
      "vn_mistake_vi": "Hay bị đọc thành 'd/đ/z' ('this' thành 'dít' hoặc 'zít'). Tự kiểm tra kép: gương thấy lưỡi giữa răng, tay trên cổ họng thấy rung — thiếu một trong hai là sai."
    },
    {
      "symbol": "s",
      "label_vi": "xì như rắn",
      "examples": [
        {
          "word": "see",
          "ipa": "/siː/"
        },
        {
          "word": "listen",
          "ipa": "/ˈlɪsn/"
        },
        {
          "word": "bus",
          "ipa": "/bʌs/"
        }
      ],
      "tip_vi": "Đầu lưỡi đưa gần lợi trên (không chạm), hơi xì qua khe hẹp thành tiếng 'sss' sắc như tiếng rắn.",
      "vn_mistake_vi": "Âm này người Việt phát âm được, vấn đề là bỏ /s/ cuối từ — mà 's' cuối gánh cả ngữ pháp số nhiều và ngôi ba ('books', 'likes'). Tự kiểm tra: nói 'books' — cuối từ phải nghe tiếng xì rõ ràng."
    },
    {
      "symbol": "z",
      "label_vi": "zờ ong kêu",
      "examples": [
        {
          "word": "zoo",
          "ipa": "/zuː/"
        },
        {
          "word": "music",
          "ipa": "/ˈmjuːzɪk/"
        },
        {
          "word": "dogs",
          "ipa": "/dɔːɡz/"
        }
      ],
      "tip_vi": "Khẩu hình y hệt /s/ nhưng rung dây thanh — kêu 'zzz' như con ong. Chú ý: 's' cuối sau âm rung (dogs, plays) thực chất đọc là /z/.",
      "vn_mistake_vi": "Hay bị đọc thành /s/ hoặc bỏ hẳn ở cuối từ ('dogs' thành 'đóc'). Tự kiểm tra: đặt tay lên cổ họng, kéo dài 'zzz' phải thấy rung, còn 'sss' thì không."
    },
    {
      "symbol": "ʃ",
      "label_vi": "suỵt",
      "examples": [
        {
          "word": "she",
          "ipa": "/ʃiː/"
        },
        {
          "word": "shine",
          "ipa": "/ʃaɪn/"
        },
        {
          "word": "fish",
          "ipa": "/fɪʃ/"
        }
      ],
      "tip_vi": "Chính là âm 'suỵt!' khi ra hiệu im lặng: lưỡi rút về sau hơn /s/ một chút, môi chu nhẹ, hơi xì ra rộng và trầm hơn 'sss'.",
      "vn_mistake_vi": "Hay lẫn với /s/ ('she' và 'see' đọc giống nhau) và bỏ /ʃ/ cuối ('fish' thành 'phi'). Tự kiểm tra: nói 'suỵt' rồi giữ nguyên khẩu hình đó mà nói 'she' — môi phải hơi chu ra."
    },
    {
      "symbol": "ʒ",
      "label_vi": "suỵt có rung",
      "examples": [
        {
          "word": "usually",
          "ipa": "/ˈjuːʒuəli/"
        },
        {
          "word": "television",
          "ipa": "/ˈtelɪvɪʒn/"
        },
        {
          "word": "measure",
          "ipa": "/ˈmeʒər/"
        }
      ],
      "tip_vi": "Khẩu hình y hệt /ʃ/ (môi chu, lưỡi rút sau) nhưng rung dây thanh. Âm hiếm nhất tiếng Anh, chủ yếu nằm giữa từ: usually, decision, pleasure.",
      "vn_mistake_vi": "Hay bị đọc thành 'd/gi' hoặc /z/ ('usually' thành 'iu-du-ơ-li'). Tự kiểm tra: giữ khẩu hình 'suỵt', bật rung cổ họng — nghe phải giống /ʃ/ phiên bản trầm, không giống 'dờ'."
    },
    {
      "symbol": "h",
      "label_vi": "hờ hà hơi",
      "examples": [
        {
          "word": "hello",
          "ipa": "/həˈloʊ/"
        },
        {
          "word": "house",
          "ipa": "/haʊs/"
        },
        {
          "word": "behind",
          "ipa": "/bɪˈhaɪnd/"
        }
      ],
      "tip_vi": "Thở nhẹ một luồng hơi từ họng như hà hơi vào gương, không cọ xát mạnh — gần như 'h' tiếng Việt, chỉ nhẹ hơi hơn.",
      "vn_mistake_vi": "Âm dễ với người Việt; lỗi chính là đọc cả 'h' câm — 'hour' đọc là /ˈaʊər/ và 'honest' là /ˈɑːnɪst/, hoàn toàn không có /h/. Tự kiểm tra: tra IPA khi gặp từ bắt đầu bằng 'h' lạ."
    },
    {
      "symbol": "tʃ",
      "label_vi": "chờ bật hơi",
      "examples": [
        {
          "word": "chair",
          "ipa": "/tʃeər/"
        },
        {
          "word": "teacher",
          "ipa": "/ˈtiːtʃər/"
        },
        {
          "word": "watch",
          "ipa": "/wɑːtʃ/"
        }
      ],
      "tip_vi": "Bắt đầu như /t/ (đầu lưỡi chặn ở lợi trên) rồi bung ra thành /ʃ/ — một tiếng 'ch' gọn, nén hơi và bật mạnh hơn 'ch' tiếng Việt.",
      "vn_mistake_vi": "Đọc như 'ch' tiếng Việt thì quá nhẹ, và /tʃ/ cuối hay bị bỏ ('watch' thành 'goa'). Tự kiểm tra: nói 'watch' — cuối từ phải nghe cả tiếng chặn lẫn tiếng xì ngắn, như 'oách-chs'."
    },
    {
      "symbol": "dʒ",
      "label_vi": "chờ có rung (gi nén)",
      "examples": [
        {
          "word": "jam",
          "ipa": "/dʒæm/"
        },
        {
          "word": "jeans",
          "ipa": "/dʒiːnz/"
        },
        {
          "word": "age",
          "ipa": "/eɪdʒ/"
        }
      ],
      "tip_vi": "Y hệt /tʃ/ nhưng rung dây thanh: lưỡi chặn ở lợi trên, nén hơi rồi bung ra kèm tiếng rung. Không phải 'gi' tiếng Việt trôi tuột — phải có độ nén.",
      "vn_mistake_vi": "Hay đọc thành 'gi/d' tiếng Việt ('job' thành 'dóp') và bỏ ở cuối từ ('age' thành 'ây', 'village' mất đuôi). Tự kiểm tra: cổ họng phải rung ngay từ lúc lưỡi còn đang chặn hơi."
    },
    {
      "symbol": "m",
      "label_vi": "mờ",
      "examples": [
        {
          "word": "man",
          "ipa": "/mæn/"
        },
        {
          "word": "summer",
          "ipa": "/ˈsʌmər/"
        },
        {
          "word": "team",
          "ipa": "/tiːm/"
        }
      ],
      "tip_vi": "Mím hai môi, để hơi thoát qua mũi và ngân lên — giống hệt 'm' tiếng Việt.",
      "vn_mistake_vi": "Ít sai vị trí, nhưng /m/ cuối hay bị cắt cụt ('team' thành 'ti'). Tự kiểm tra: nói 'team' — hai môi phải mím lại ở cuối từ và ngân được tiếng 'mmm' ngắn."
    },
    {
      "symbol": "n",
      "label_vi": "nờ",
      "examples": [
        {
          "word": "no",
          "ipa": "/noʊ/"
        },
        {
          "word": "funny",
          "ipa": "/ˈfʌni/"
        },
        {
          "word": "rain",
          "ipa": "/reɪn/"
        }
      ],
      "tip_vi": "Đầu lưỡi chạm lợi trên, hơi thoát qua mũi — như 'n' tiếng Việt, nhưng cuối từ lưỡi phải thật sự chạm lợi.",
      "vn_mistake_vi": "Thói quen miền Nam hay biến /n/ cuối thành /ŋ/ ('rain' thành 'reng', 'nine' thành 'nai-ng'). Tự kiểm tra: kết thúc từ, đầu lưỡi phải đang dính vào lợi trên — cuống lưỡi chạm vòm là đang nói /ŋ/."
    },
    {
      "symbol": "ŋ",
      "label_vi": "ngờ",
      "examples": [
        {
          "word": "sing",
          "ipa": "/sɪŋ/"
        },
        {
          "word": "English",
          "ipa": "/ˈɪŋɡlɪʃ/"
        },
        {
          "word": "long",
          "ipa": "/lɔːŋ/"
        }
      ],
      "tip_vi": "Cuống lưỡi chạm vòm mềm, hơi ngân qua mũi — chính là 'ng' tiếng Việt trong 'ngủ'. Đây là âm người Việt có lợi thế tuyệt đối.",
      "vn_mistake_vi": "Hầu như không sai âm này; lỗi duy nhất là thêm /ɡ/ hoặc /k/ thừa ở cuối ('sing' thành 'sing-gơ'). Tự kiểm tra: nói 'sing' — kết thúc gọn trong mũi, không có tiếng bật nào sau đó."
    },
    {
      "symbol": "l",
      "label_vi": "lờ (chú ý l cuối từ)",
      "examples": [
        {
          "word": "light",
          "ipa": "/laɪt/"
        },
        {
          "word": "hello",
          "ipa": "/həˈloʊ/"
        },
        {
          "word": "feel",
          "ipa": "/fiːl/"
        }
      ],
      "tip_vi": "Đầu lưỡi chạm lợi trên, hơi thoát ra hai bên lưỡi. Với /l/ cuối từ (dark L), đầu lưỡi vẫn phải chạm lợi trong khi cuống lưỡi hơi nâng lên — nghe trầm như 'ồ-l'.",
      "vn_mistake_vi": "/l/ cuối hay biến thành 'n' hoặc 'u' ('feel' thành 'phiu', 'school' thành 'sờ-cun'). Tự kiểm tra: nói 'feel' và giữ âm cuối — đầu lưỡi phải đang chạm lợi trên, không lơ lửng."
    },
    {
      "symbol": "r",
      "label_vi": "rờ cuộn lưỡi, không rung lưỡi",
      "examples": [
        {
          "word": "red",
          "ipa": "/red/"
        },
        {
          "word": "sorry",
          "ipa": "/ˈsɑːri/"
        },
        {
          "word": "four",
          "ipa": "/fɔːr/"
        }
      ],
      "tip_vi": "Cuộn nhẹ đầu lưỡi về phía sau, KHÔNG để lưỡi chạm vào bất cứ đâu, môi hơi chu tròn rồi phát âm. Lưỡi đứng yên hoàn toàn, không rung phần phật.",
      "vn_mistake_vi": "Hay đọc thành 'r' rung lưỡi kiểu tiếng Việt, hoặc thành 'g/z' theo giọng vùng miền ('red' thành 'gét/zét'). Tự kiểm tra: kéo dài 'rrr' 3 giây — nếu lưỡi rung lạch tạch là sai, âm /r/ tiếng Anh giữ được đều tăm tắp."
    },
    {
      "symbol": "w",
      "label_vi": "quờ môi tròn",
      "examples": [
        {
          "word": "we",
          "ipa": "/wiː/"
        },
        {
          "word": "question",
          "ipa": "/ˈkwestʃən/"
        },
        {
          "word": "always",
          "ipa": "/ˈɔːlweɪz/"
        }
      ],
      "tip_vi": "Chu tròn hai môi như chuẩn bị huýt sáo rồi mở nhanh sang nguyên âm sau — như âm lướt 'u-' trong 'qua' tiếng Việt. Răng không chạm môi.",
      "vn_mistake_vi": "Hay đọc thành /v/ ('what' thành 'vót') hoặc bỏ /w/ trong cụm /kw/ ('question' thành 'két-sừn'). Tự kiểm tra bằng gương: trước khi phát âm, môi phải chu tròn rõ rệt — môi chạm răng là đang nói /v/."
    },
    {
      "symbol": "j",
      "label_vi": "dờ lướt (như 'y')",
      "examples": [
        {
          "word": "yes",
          "ipa": "/jes/"
        },
        {
          "word": "year",
          "ipa": "/jɪər/"
        },
        {
          "word": "music",
          "ipa": "/ˈmjuːzɪk/"
        }
      ],
      "tip_vi": "Nâng giữa lưỡi lên gần vòm cứng như sắp nói 'i', rồi trượt nhanh sang nguyên âm sau — một âm lướt mượt, không có ma sát hay cọ xát.",
      "vn_mistake_vi": "Hay đọc thành 'd/gi' nặng và cọ xát ('yes' thành 'dét'), hoặc bỏ /j/ khiến 'year' nghe thành 'ear'. Tự kiểm tra: nói 'i-ét' thật nhanh và mượt — đó chính là 'yes'; nghe thấy tiếng cọ 'dờ' là sai."
    }
  ],
  "pairSets": [
    {
      "contrast": "ɪ vs iː",
      "label_vi": "i ngắn vs i dài — ship hay sheep?",
      "pairs": [
        {
          "a": "ship",
          "b": "sheep",
          "a_vi": "con tàu",
          "b_vi": "con cừu"
        },
        {
          "a": "sit",
          "b": "seat",
          "a_vi": "ngồi",
          "b_vi": "chỗ ngồi"
        },
        {
          "a": "chip",
          "b": "cheap",
          "a_vi": "lát khoai/con chip",
          "b_vi": "rẻ"
        },
        {
          "a": "fill",
          "b": "feel",
          "a_vi": "đổ đầy",
          "b_vi": "cảm thấy"
        },
        {
          "a": "hit",
          "b": "heat",
          "a_vi": "đánh",
          "b_vi": "sức nóng"
        }
      ]
    },
    {
      "contrast": "e vs æ",
      "label_vi": "e vs a bẹt — pen hay pan?",
      "pairs": [
        {
          "a": "bed",
          "b": "bad",
          "a_vi": "cái giường",
          "b_vi": "tồi tệ"
        },
        {
          "a": "men",
          "b": "man",
          "a_vi": "đàn ông (số nhiều)",
          "b_vi": "người đàn ông"
        },
        {
          "a": "pen",
          "b": "pan",
          "a_vi": "cây bút",
          "b_vi": "cái chảo"
        },
        {
          "a": "send",
          "b": "sand",
          "a_vi": "gửi",
          "b_vi": "cát"
        },
        {
          "a": "head",
          "b": "had",
          "a_vi": "cái đầu",
          "b_vi": "đã có"
        }
      ]
    },
    {
      "contrast": "ʊ vs uː",
      "label_vi": "u ngắn vs u dài — full hay fool?",
      "pairs": [
        {
          "a": "full",
          "b": "fool",
          "a_vi": "đầy",
          "b_vi": "kẻ ngốc"
        },
        {
          "a": "pull",
          "b": "pool",
          "a_vi": "kéo",
          "b_vi": "hồ bơi"
        },
        {
          "a": "look",
          "b": "Luke",
          "a_vi": "nhìn",
          "b_vi": "tên riêng Luke"
        },
        {
          "a": "soot",
          "b": "suit",
          "a_vi": "bồ hóng",
          "b_vi": "bộ vest"
        },
        {
          "a": "stood",
          "b": "stewed",
          "a_vi": "đã đứng",
          "b_vi": "đã hầm nhừ"
        }
      ]
    },
    {
      "contrast": "ɑː vs ʌ",
      "label_vi": "a mở họng vs ă bật — lock hay luck?",
      "pairs": [
        {
          "a": "lock",
          "b": "luck",
          "a_vi": "ổ khoá",
          "b_vi": "may mắn"
        },
        {
          "a": "shot",
          "b": "shut",
          "a_vi": "cú bắn/cú sút",
          "b_vi": "đóng lại"
        },
        {
          "a": "cop",
          "b": "cup",
          "a_vi": "cảnh sát",
          "b_vi": "cái cốc"
        },
        {
          "a": "not",
          "b": "nut",
          "a_vi": "không",
          "b_vi": "hạt/đai ốc"
        },
        {
          "a": "dock",
          "b": "duck",
          "a_vi": "bến tàu",
          "b_vi": "con vịt"
        }
      ]
    },
    {
      "contrast": "s vs ʃ",
      "label_vi": "s vs sh — see hay she?",
      "pairs": [
        {
          "a": "see",
          "b": "she",
          "a_vi": "nhìn thấy",
          "b_vi": "cô ấy"
        },
        {
          "a": "seat",
          "b": "sheet",
          "a_vi": "chỗ ngồi",
          "b_vi": "tấm ga/tờ giấy"
        },
        {
          "a": "save",
          "b": "shave",
          "a_vi": "tiết kiệm",
          "b_vi": "cạo râu"
        },
        {
          "a": "same",
          "b": "shame",
          "a_vi": "giống nhau",
          "b_vi": "nỗi xấu hổ"
        },
        {
          "a": "sock",
          "b": "shock",
          "a_vi": "chiếc tất",
          "b_vi": "cú sốc"
        }
      ]
    },
    {
      "contrast": "tʃ vs dʒ",
      "label_vi": "ch vs j — cheap hay jeep?",
      "pairs": [
        {
          "a": "cheap",
          "b": "jeep",
          "a_vi": "rẻ",
          "b_vi": "xe jeep"
        },
        {
          "a": "choke",
          "b": "joke",
          "a_vi": "nghẹn",
          "b_vi": "trò đùa"
        },
        {
          "a": "chin",
          "b": "gin",
          "a_vi": "cằm",
          "b_vi": "rượu gin"
        },
        {
          "a": "batch",
          "b": "badge",
          "a_vi": "mẻ/lô hàng",
          "b_vi": "huy hiệu"
        },
        {
          "a": "rich",
          "b": "ridge",
          "a_vi": "giàu",
          "b_vi": "sống núi"
        }
      ]
    },
    {
      "contrast": "θ vs t",
      "label_vi": "th lè lưỡi vs t — three hay tree?",
      "pairs": [
        {
          "a": "three",
          "b": "tree",
          "a_vi": "số ba",
          "b_vi": "cái cây"
        },
        {
          "a": "thin",
          "b": "tin",
          "a_vi": "gầy/mỏng",
          "b_vi": "hộp thiếc"
        },
        {
          "a": "thank",
          "b": "tank",
          "a_vi": "cảm ơn",
          "b_vi": "xe tăng/bể chứa"
        },
        {
          "a": "thought",
          "b": "taught",
          "a_vi": "đã nghĩ",
          "b_vi": "đã dạy"
        },
        {
          "a": "both",
          "b": "boat",
          "a_vi": "cả hai",
          "b_vi": "con thuyền"
        }
      ]
    },
    {
      "contrast": "ð vs d",
      "label_vi": "th hữu thanh vs d — they hay day?",
      "pairs": [
        {
          "a": "they",
          "b": "day",
          "a_vi": "họ",
          "b_vi": "ngày"
        },
        {
          "a": "then",
          "b": "den",
          "a_vi": "sau đó",
          "b_vi": "hang thú"
        },
        {
          "a": "there",
          "b": "dare",
          "a_vi": "ở đó",
          "b_vi": "dám"
        },
        {
          "a": "though",
          "b": "dough",
          "a_vi": "mặc dù",
          "b_vi": "bột nhào"
        },
        {
          "a": "breathe",
          "b": "breed",
          "a_vi": "hít thở",
          "b_vi": "nhân giống"
        }
      ]
    },
    {
      "contrast": "l vs n (cuối từ)",
      "label_vi": "l vs n cuối từ — tell hay ten?",
      "pairs": [
        {
          "a": "tell",
          "b": "ten",
          "a_vi": "kể/bảo",
          "b_vi": "số mười"
        },
        {
          "a": "well",
          "b": "when",
          "a_vi": "tốt/giếng nước",
          "b_vi": "khi nào"
        },
        {
          "a": "pill",
          "b": "pin",
          "a_vi": "viên thuốc",
          "b_vi": "cây ghim"
        },
        {
          "a": "file",
          "b": "fine",
          "a_vi": "tệp/hồ sơ",
          "b_vi": "ổn/tốt"
        },
        {
          "a": "meal",
          "b": "mean",
          "a_vi": "bữa ăn",
          "b_vi": "có nghĩa là"
        }
      ]
    },
    {
      "contrast": "s vs z (cuối từ)",
      "label_vi": "s vs z cuối từ — price hay prize?",
      "pairs": [
        {
          "a": "price",
          "b": "prize",
          "a_vi": "giá tiền",
          "b_vi": "giải thưởng"
        },
        {
          "a": "rice",
          "b": "rise",
          "a_vi": "gạo/cơm",
          "b_vi": "tăng lên"
        },
        {
          "a": "advice",
          "b": "advise",
          "a_vi": "lời khuyên",
          "b_vi": "khuyên (động từ)"
        },
        {
          "a": "peace",
          "b": "peas",
          "a_vi": "hòa bình",
          "b_vi": "đậu Hà Lan"
        },
        {
          "a": "bus",
          "b": "buzz",
          "a_vi": "xe buýt",
          "b_vi": "tiếng vo ve"
        }
      ]
    }
  ],
  "articles": [
    {
      "id": "lap-lai-ngat-quang-active-recall",
      "icon": "🧠",
      "title_vi": "Lặp lại ngắt quãng & Active Recall: Vì sao flashcard thắng đọc lại",
      "summary_vi": "Đọc đi đọc lại tạo cảm giác \"thuộc rồi\" nhưng thực ra não chỉ thấy quen mắt. Chủ động lôi kiến thức ra khỏi đầu (active recall) kết hợp ôn đúng thời điểm sắp quên (spaced repetition) mới là cách ghi nhớ bền.",
      "sections": [
        {
          "heading_vi": "Cái bẫy của việc đọc lại",
          "body_vi": "Khi bạn đọc lại danh sách từ vựng lần thứ ba, mọi thứ trông quen thuộc và não kết luận: \"Ổn, thuộc rồi.\" Nhưng quen mắt không đồng nghĩa với nhớ được. Đến lúc cần dùng từ đó trong câu nói thật, bạn sẽ đứng hình vì chưa bao giờ tập thao tác \"lôi từ ra khỏi đầu\" — bạn mới chỉ tập \"nhìn thấy nó trên giấy\". Đây là ảo giác trôi chảy: tài liệu càng đọc nhiều lần càng dễ đọc, nhưng độ dễ đó là của trang giấy, không phải của trí nhớ bạn."
        },
        {
          "heading_vi": "Active recall: cố nhớ trước, lật thẻ sau",
          "body_vi": "Mỗi lần bạn cố gắng nhớ một từ mà chưa nhìn đáp án, kể cả khi nhớ sai, kết nối trong não được củng cố mạnh hơn nhiều so với đọc lại thụ động. Vì thế quy tắc số một khi dùng flashcard: nhìn mặt trước, tự trả lời thành tiếng, rồi mới lật. Đừng lật vội sau 1 giây — hãy chịu đựng cảm giác \"gần nhớ ra rồi\" khoảng 5-10 giây, chính khoảnh khắc vật lộn đó là lúc não học. Nếu chỉ nhớ mang máng, hãy bấm 'Chưa nhớ' để thẻ quay lại ngay cuối phiên — đừng bấm 'Nhớ rồi' cho qua."
        },
        {
          "heading_vi": "Spaced repetition: ôn đúng lúc sắp quên",
          "body_vi": "Trí nhớ phai theo thời gian, nhưng mỗi lần bạn ôn lại đúng lúc sắp quên, đường cong quên lãng phẳng dần ra — nghĩa là lần sau bạn nhớ lâu hơn. Thay vì ôn 462 từ mỗi ngày (bất khả thi), hệ SRS trong trang Flashcard tự xếp lịch: từ dễ thì giãn ra 3 ngày, 1 tuần, 1 tháng; từ hay quên thì quay lại sớm hơn. Việc của bạn chỉ là mở app mỗi ngày và ôn hết số thẻ đến hạn — thuật toán lo phần còn lại. Đừng \"để dành\" thẻ đến hạn sang hôm sau, vì để dồn 2-3 ngày là số thẻ phình lên và bạn sẽ nản."
        },
        {
          "heading_vi": "Lịch học gợi ý cho 462 từ",
          "body_vi": "Công thức đơn giản: mỗi ngày ôn hết thẻ đến hạn TRƯỚC, rồi mới học 10-15 thẻ mới. Với nhịp 10 thẻ mới/ngày, bạn đi hết 462 từ trong khoảng 7 tuần, và phần lớn số đó đã nằm trong trí nhớ dài hạn nhờ các lần ôn tự động. Nếu một ngày bận, chỉ cần ôn thẻ đến hạn và bỏ qua thẻ mới — giữ nhịp ôn quan trọng hơn tốc độ học mới. Mẹo nhỏ: với mỗi từ mới, tự đặt một câu có bối cảnh của chính bạn (\"I'm exhausted after work\" thay vì chỉ nhớ exhausted = kiệt sức) — từ gắn với đời thật thì khó quên hơn hẳn."
        }
      ],
      "action_vi": "Mở trang Flashcard ngay bây giờ, ôn hết số thẻ đến hạn hôm nay rồi học 10 thẻ mới — với mỗi thẻ, tự trả lời thành tiếng trước khi lật và chấm điểm trung thực."
    },
    {
      "id": "shadowing-dung-cach-tung-buoc",
      "icon": "🗣️",
      "title_vi": "Shadowing đúng cách: 5 bước từ nghe vẹt đến nói tự nhiên",
      "summary_vi": "Shadowing là nhại theo audio gần như đồng thời — cách luyện phát âm, ngữ điệu và phản xạ nghe cùng lúc. Làm đúng thì tiến bộ rõ sau vài tuần; làm sai (chọn bài quá khó, nhại khi chưa hiểu) thì chỉ mỏi miệng.",
      "sections": [
        {
          "heading_vi": "Shadowing là gì và vì sao đáng làm",
          "body_vi": "Shadowing là bật một đoạn audio và nói đuổi theo người nói, trễ hơn họ khoảng 1-2 từ, bắt chước cả tốc độ, trọng âm lẫn ngữ điệu lên xuống. Nó ép tai bạn xử lý âm thanh theo thời gian thực và ép miệng bạn tạo ra đúng những âm đó — hai kỹ năng người Việt tự học hay yếu nhất. Khác với đọc to, shadowing buộc bạn khớp với nhịp của người bản xứ, nên bạn học được cách họ nối âm, nuốt âm và nhấn câu. Mỗi ngày 15-20 phút là đủ; đây là bài tập cường độ cao, làm lâu hơn dễ kiệt sức."
        },
        {
          "heading_vi": "Bước 1-2: Chọn đoạn ngắn và hiểu trước khi nhại",
          "body_vi": "Chọn một đoạn audio 30-60 giây, tốc độ vừa phải, chủ đề bạn thích — tab Nghe của Luyện kỹ năng có các CÂU ngắn đọc bằng nút 🔊/🐢 để shadowing từng câu; muốn đoạn dài 30-60 giây thì lấy từ BBC Learning English hoặc VOA như lộ trình gợi ý. Nghe 2-3 lần không nhìn gì cả, xem mình hiểu bao nhiêu. Sau đó đọc transcript, tra hết từ mới, nghe lại một lần nữa cho đến khi hiểu trọn nghĩa. Tuyệt đối không shadowing một đoạn mình chưa hiểu — lúc đó bạn chỉ đang nhại vẹt âm thanh vô nghĩa, miệng mỏi mà não không học được gì."
        },
        {
          "heading_vi": "Bước 3: Đọc theo cùng transcript",
          "body_vi": "Bật audio và đọc to theo, mắt nhìn transcript, cố khớp tốc độ với người nói. Lần đầu bạn sẽ bị tụt lại — bình thường, cứ nhảy cóc bắt kịp thay vì dừng lại. Làm 2-3 lượt cho đến khi theo kịp mà không vấp. Ở bước này hãy để ý những chỗ người nói nối âm (\"want to\" thành \"wanna\", \"an apple\" thành \"a-napple\") và bắt chước y hệt, đừng đọc rời từng từ như trong từ điển."
        },
        {
          "heading_vi": "Bước 4: Bỏ transcript, nhại đuổi",
          "body_vi": "Giờ mới là shadowing thật: cất transcript, bật audio và nói đuổi theo, trễ 1-2 từ. Ba lượt đầu bạn sẽ rớt liên tục — cứ bỏ qua chỗ rớt và bám tiếp, đừng tua lại giữa chừng. Mục tiêu không phải hoàn hảo 100% mà là giữ được nhịp và ngữ điệu tổng thể. Một đoạn nên shadowing 5-10 lượt, rải ra 2-3 ngày; đến khi bạn nhại được trơn tru cả đoạn thì đổi bài mới."
        },
        {
          "heading_vi": "Bước 5: Ghi âm và so với bản gốc",
          "body_vi": "Mỗi tuần một lần, ghi âm lượt shadowing của mình (dùng Voice Memos trên máy là đủ) rồi nghe xen kẽ: một câu bản gốc, một câu bản của bạn. Bạn sẽ nghe ra ngay 2-3 điểm khác biệt lớn nhất — thường là trọng âm đặt sai chỗ, âm cuối bị nuốt, hoặc ngữ điệu đều đều kiểu tiếng Việt. Chỉ chọn MỘT điểm để sửa trong tuần đó, sửa xong mới sang điểm tiếp theo. Nghe giọng mình lúc đầu rất ngượng, nhưng đó là phản hồi trung thực nhất bạn có khi không có giáo viên."
        }
      ],
      "action_vi": "Vào Luyện kỹ năng → Nghe, bật timer Pomodoro 15 phút và shadowing 10 câu của chặng bạn: bấm 🔊 nghe từng câu rồi nhại lại ngay, câu khó nghe 🐢 chậm."
    },
    {
      "id": "comprehensible-input-chon-tai-lieu-vua-suc",
      "icon": "📖",
      "title_vi": "Comprehensible Input: Chọn tài liệu vừa sức — không quá dễ, không quá khó",
      "summary_vi": "Bạn tiến bộ nhanh nhất khi nghe/đọc thứ mình hiểu gần hết nhưng vẫn còn chút thử thách. Bài viết này cho bạn quy tắc đếm cụ thể để biết một tài liệu là vừa sức, quá khó hay quá dễ.",
      "sections": [
        {
          "heading_vi": "Nguyên lý: hiểu được thì mới hấp thụ được",
          "body_vi": "Não học ngôn ngữ hiệu quả nhất khi tiếp nhận nội dung nó hiểu khoảng 90-98%, cộng thêm một lớp mỏng cái mới — thường gọi là \"i+1\": trình độ hiện tại cộng một bậc nhỏ. Khi tài liệu quá khó, bạn chuyển sang chế độ giải mã từng từ, tra từ điển liên tục, và không còn xử lý ngôn ngữ như ngôn ngữ nữa. Khi quá dễ, không có gì mới để hấp thụ. Cảm giác chuẩn của tài liệu vừa sức: đọc/nghe trôi, nắm được câu chuyện, thỉnh thoảng gặp từ lạ nhưng đoán được nghĩa nhờ ngữ cảnh."
        },
        {
          "heading_vi": "Quy tắc đếm nhanh: bài đọc và bài nghe",
          "body_vi": "Với bài đọc: lấy một đoạn khoảng 100 từ và đếm số từ bạn không biết. Từ 2-5 từ mới là vùng vàng — đủ mới để học, đủ quen để đoán nghĩa từ ngữ cảnh. Trên 10 từ mới nghĩa là quá khó, hãy lùi xuống một bậc; dưới 2 từ thì có thể tiến lên. Với bài nghe: nghe một lượt không dừng, không transcript — nếu bạn kể lại được ý chính thì vừa sức; nếu chỉ bắt được từ rời rạc thì quá khó, còn nếu hiểu 100% không cần cố gắng thì nên tăng độ khó hoặc tăng tốc độ phát."
        },
        {
          "heading_vi": "Vừa sức thôi chưa đủ — cần đủ nhiều",
          "body_vi": "Input dễ hiểu chỉ phát huy khi khối lượng lớn: đọc 10 trang dễ mỗi tuần thắng xa việc vật lộn với 1 trang khó. Vì vậy hãy ưu tiên chủ đề bạn thực sự tò mò — truyện, bóng đá, nấu ăn, gì cũng được — vì hứng thú là thứ duy nhất giữ bạn đọc/nghe đủ nhiều. Đừng ngại đọc thứ \"trẻ con\" so với tuổi mình; ở trình độ A2 thì truyện thiếu nhi tiếng Anh là giáo trình hoàn hảo. Nguyên tắc: thà hiểu 95% của nội dung đơn giản còn hơn hiểu 40% của nội dung \"sang\"."
        },
        {
          "heading_vi": "Áp vào lộ trình 0→B2 của bạn",
          "body_vi": "Các bài đọc trong Luyện kỹ năng → Đọc đã xếp theo chặng từ dễ đến khó, nên cách an toàn nhất là đi tuần tự và dùng quy tắc đếm ở trên để tự kiểm tra. Nếu một bài khiến bạn phải dừng tra từ mỗi câu, đó là tín hiệu lùi lại ôn bài trước, không phải tín hiệu \"cố thêm\". Ngược lại, khi một bài dễ đến mức chán, đó chính xác là lúc bạn được phép nhảy tiếp — chán là dấu hiệu tốt nghiệp. Từ mới nhặt được từ bài đọc/nghe, hãy đưa vào flashcard để chúng không trôi mất."
        }
      ],
      "action_vi": "Mở Luyện kỹ năng → Đọc, chọn bài kế tiếp của chặng bạn và làm phép thử 100 từ: đếm từ mới trong đoạn đầu — trên 10 từ thì lùi một bài để ôn, từ 2-5 từ thì học tiếp và thêm từ mới vào Flashcard."
    },
    {
      "id": "thoi-quen-hoc-deu-moi-ngay",
      "icon": "🔥",
      "title_vi": "Học đều mỗi ngày: Thiết kế thói quen cho người hay mất tập trung",
      "summary_vi": "Vấn đề không phải bạn thiếu ý chí — mà là việc học được thiết kế quá khó để bắt đầu. Phiên ngắn, phần thưởng tức thì và giảm số quyết định phải đưa ra là ba đòn bẩy giúp người dễ xao nhãng (kể cả ADHD) học đều.",
      "sections": [
        {
          "heading_vi": "Thủ phạm thật: chi phí khởi động, không phải ý chí",
          "body_vi": "Với người dễ mất tập trung, rào cản lớn nhất không phải 25 phút học mà là 30 giây đầu tiên: mở máy, quyết định học gì, bắt đầu từ đâu. Mỗi quyết định nhỏ đó là một cánh cửa để não trốn sang TikTok. Giải pháp không phải \"cố gắng hơn\" mà là thiết kế lại sao cho việc bắt đầu gần như không tốn công: biết trước học gì, học lúc nào, trong bao lâu. Khi khởi động đủ rẻ, bạn sẽ bắt đầu — và bắt đầu được là xong 80% trận đánh."
        },
        {
          "heading_vi": "Phiên ngắn thắng phiên dài",
          "body_vi": "15 phút mỗi ngày ăn đứt 3 tiếng sáng Chủ nhật, vì hai lý do: trí nhớ cần lặp lại rải ra nhiều ngày (đúng nguyên lý spaced repetition), và phiên ngắn thì không tạo cảm giác sợ hãi trước khi bắt đầu. Hãy dùng timer Pomodoro trên web: đặt 15 hoặc 25 phút, học đến khi chuông reo thì DỪNG — kể cả đang hăng. Dừng lúc còn hứng khiến hôm sau bạn muốn quay lại; học đến kiệt sức khiến hôm sau bạn né. Nếu 15 phút vẫn khó, bắt đầu bằng 5 phút — một phiên 5 phút có thật vẫn hơn một phiên 2 tiếng trong tưởng tượng."
        },
        {
          "heading_vi": "Giảm lựa chọn: quyết định một lần, dùng cả tuần",
          "body_vi": "Đừng để mỗi ngày phải tự hỏi \"hôm nay học gì\" — câu hỏi đó chính là chỗ thói quen chết. Hãy chốt sẵn một công thức cố định, ví dụ: mở web → ôn flashcard đến hạn → làm tiếp bài học đang dở → hết giờ thì thôi. Gắn nó vào một mốc có sẵn trong ngày (ngay sau cà phê sáng, hoặc ngay khi về đến nhà) thay vì \"lúc nào rảnh\" — vì \"lúc nào rảnh\" không bao giờ đến. Cùng một giờ, cùng một chỗ ngồi, cùng một trình tự: não bạn sẽ chuyển sang chế độ học mà không cần đàm phán."
        },
        {
          "heading_vi": "Phần thưởng tức thì, không phải lời hứa xa xôi",
          "body_vi": "\"Giỏi tiếng Anh sau 1 năm\" là phần thưởng quá xa để não dễ xao nhãng quan tâm — nó cần thứ gì đó NGAY BÂY GIỜ. Web này có sẵn hai cỗ máy phần thưởng: chuỗi ngày học (đừng để tắt lửa!) và 3 game trong Luyện kỹ năng. Hãy cấu trúc phiên học theo kiểu: việc khó trước (flashcard, bài học), rồi kết phiên bằng một ván game như món tráng miệng. Đánh dấu được chuỗi ngày hôm nay là một cú \"thắng\" nhỏ — và với não dễ mất tập trung, chuỗi thắng nhỏ mỗi ngày mạnh hơn mọi kế hoạch vĩ đại."
        },
        {
          "heading_vi": "Khi đứt chuỗi: quy tắc không-nghỉ-2-ngày",
          "body_vi": "Bạn sẽ có ngày bỏ học — ai cũng vậy, đó không phải thất bại. Thất bại thật là ngày bỏ thứ hai liên tiếp, vì 2 ngày là lúc thói quen bắt đầu tuột. Quy tắc duy nhất cần nhớ: không bao giờ nghỉ 2 ngày liền, và một \"phiên cứu chuỗi\" 5 phút ôn flashcard vẫn tính là học. Tuyệt đối đừng đền bù ngày nghỉ bằng phiên marathon 3 tiếng — nó chỉ khiến bạn sợ và né tiếp. Quay lại nhịp bình thường, nhẹ nhàng như chưa có gì xảy ra."
        }
      ],
      "action_vi": "Bật timer Pomodoro 15 phút ngay bây giờ, ôn hết flashcard đến hạn, rồi kết phiên bằng một ván game trong Luyện kỹ năng để giữ chuỗi ngày học hôm nay."
    },
    {
      "id": "hoc-tu-vung-theo-cum-collocations",
      "icon": "🧩",
      "title_vi": "Học từ theo cụm (collocations): Đừng nhặt từng viên gạch, hãy lấy nguyên bức tường",
      "summary_vi": "Biết \"make\" và \"decision\" không có nghĩa là bạn nói được \"make a decision\" — người Việt hay bật ra \"do a decision\" vì học từ đơn lẻ. Học nguyên cụm giúp nói nhanh hơn, tự nhiên hơn và ít lỗi hơn.",
      "sections": [
        {
          "heading_vi": "Vì sao từ đơn phản bội bạn khi nói",
          "body_vi": "Người bản xứ không ghép câu từ từng từ một — họ nói bằng những cụm đúc sẵn: make a decision, heavy rain, it depends on. Khi bạn học từ đơn rồi tự ghép theo logic tiếng Việt, ra ngay những cụm sai kiểu \"do a decision\", \"strong rain\", \"depend into\". Tệ hơn, ghép từng từ khi nói khiến não quá tải: vừa nhớ từ, vừa chia thì, vừa xếp trật tự — nên bạn ấp úng. Lấy nguyên cụm ra dùng thì chỉ tốn một \"lượt nhớ\", nói trôi hơn hẳn mà ngữ pháp bên trong cụm đã đúng sẵn."
        },
        {
          "heading_vi": "Nhận diện cụm đáng học khi đọc và nghe",
          "body_vi": "Ba loại cụm đáng tiền nhất: động từ + danh từ (take a break, catch a cold), tính từ + danh từ (heavy traffic, a huge fan), và cụm chức năng dùng trong giao tiếp (to be honest, as far as I know, it turns out). Quy tắc thực hành: mỗi khi gặp từ mới trong bài đọc hoặc bài nghe, đừng chép mỗi từ đó — chép cả 2-4 từ xung quanh nó. Ví dụ gặp \"appointment\", hãy ghi \"make an appointment\" chứ không phải \"appointment = cuộc hẹn\". Tự hỏi: từ này thường đi với động từ nào, giới từ nào? Câu trả lời nằm ngay trong câu bạn vừa đọc."
        },
        {
          "heading_vi": "Đưa cụm vào flashcard cho đúng cách",
          "body_vi": "Mặt sau thẻ nên là cả cụm kèm một câu ví dụ, không phải từ trơ trọi: thay vì \"decision = quyết định\", hãy để \"make a decision — I need to make a decision by Friday.\" Mặt trước có thể là nghĩa tiếng Việt của cả cụm, hoặc câu khuyết kiểu \"I need to ___ a decision by Friday\" để ép não nhớ đúng động từ đi kèm. Với 462 từ trong bộ Flashcard của web, hãy tự nâng cấp dần: mỗi lần ôn một từ, thử nói to một cụm chứa nó. Một từ mà bạn thuộc 2-3 cụm đi kèm đáng giá hơn ba từ chỉ thuộc nghĩa."
        },
        {
          "heading_vi": "Kích hoạt cụm: gặp 3 lần, dùng 1 lần",
          "body_vi": "Cụm chỉ nằm trong đầu thì chưa phải của bạn — phải dùng nó ra mới thành phản xạ. Đặt quy tắc \"gặp 3 lần, dùng 1 lần\": cụm nào xuất hiện lần thứ ba trong bài học hay flashcard, bạn nợ nó một câu do chính mình viết hoặc nói. Cách rẻ nhất: vào phần Luyện viết, viết 3-5 câu về ngày của bạn và cố nhét 2-3 cụm mới học vào. Câu có thể vụng, không sao — cụm được dùng trong bối cảnh thật của bạn sẽ bám chắc gấp nhiều lần cụm chỉ nằm trên thẻ."
        }
      ],
      "action_vi": "Học 10 thẻ mới trên trang Flashcard, với mỗi từ hãy nói to một cụm đi kèm nó, rồi viết 3 câu dùng 3 cụm đó vào ô Viết đoạn của chặng bạn (bản nháp tự lưu)."
    },
    {
      "id": "tu-sua-loi-khong-co-giao-vien",
      "icon": "🎙️",
      "title_vi": "Tự sửa lỗi khi không có giáo viên: Ghi âm, so bản mẫu, checklist",
      "summary_vi": "Không có giáo viên không có nghĩa là không có phản hồi. Bản mẫu chuẩn + bản ghi âm/bài viết của bạn + một checklist lỗi cá nhân là bộ ba giúp bạn tự bắt và sửa lỗi một cách có hệ thống.",
      "sections": [
        {
          "heading_vi": "Phản hồi nằm ở khoảng cách giữa bạn và bản mẫu",
          "body_vi": "Giáo viên giỏi làm gì? Họ chỉ ra khoảng cách giữa cái bạn tạo ra và cái chuẩn. Tin tốt: bạn có thể tự đo khoảng cách đó, vì bản chuẩn có sẵn khắp nơi — audio từng câu trong tab Nghe, bài đọc trong tab Đọc và bài mẫu trong tab Viết của Luyện kỹ năng. Nguyên tắc cốt lõi: luôn so sánh sản phẩm của mình với một bản mẫu cụ thể, đừng tự đánh giá bằng cảm giác \"nghe cũng ổn\". Cảm giác của người học luôn dễ dãi với chính mình; bản mẫu thì không."
        },
        {
          "heading_vi": "Kỹ năng nói: ghi âm rồi nghe đối chiếu từng câu",
          "body_vi": "Chọn 3-5 câu trong tab Nghe làm bản mẫu (🔊 nghe, câu chữ hiện sau khi chấm), rồi ghi âm mình đọc lại các câu đó (tab Nói có nút ⏺ Ghi âm) (Voice Memos trên máy là đủ). Nghe xen kẽ: một câu bản gốc, một câu của bạn — khác biệt sẽ lộ ra rõ đến mức khó chịu, và đó chính là bài học. Ghi ra đúng 3 điểm khác biệt lớn nhất, thường là: âm cuối bị nuốt (mất -s, -t, -d), trọng âm sai chỗ, ngữ điệu phẳng. Mỗi tuần chỉ tập trung sửa MỘT điểm; sửa dàn trải cả ba cùng lúc là công thức để chẳng sửa được gì."
        },
        {
          "heading_vi": "Kỹ năng viết: đọc to bài mình + soi bằng checklist",
          "body_vi": "Viết xong đoạn văn trong ô Viết đoạn (tab Viết), trước khi tự chấm checklist hãy đọc to nó lên, vì tai bắt được những lỗi mà mắt lướt qua (câu cụt, lặp từ, thiếu mạo từ). Sau đó soi bài qua checklist 5 điểm mà người Việt hay sai nhất: (1) động từ đã chia thì chưa, (2) danh từ số nhiều có -s chưa, (3) mạo từ a/an/the có thiếu không, (4) giới từ đi kèm đúng chưa, (5) có cụm nào dịch word-by-word từ tiếng Việt không. Cuối cùng, so với bài mẫu cùng chủ đề trong Bài học: xem người ta mở đoạn thế nào, nối ý bằng từ gì, rồi mượn cấu trúc đó cho bài sau."
        },
        {
          "heading_vi": "Checklist lỗi cá nhân: vũ khí lợi hại nhất",
          "body_vi": "Sau vài lần tự sửa, bạn sẽ nhận ra mình không sai lung tung — bạn sai lặp lại ở 5-7 chỗ quen thuộc. Hãy nuôi một danh sách \"lỗi ruột\" của riêng mình: mỗi lần sửa bài, cập nhật danh sách; trước khi nói hay viết bài mới, liếc qua nó 30 giây như phi công đọc checklist trước khi cất cánh. Lỗi nào 2 tuần liền không tái phạm thì gạch khỏi danh sách và thêm lỗi mới vào. Danh sách này chính là \"giáo viên riêng\" hiểu bạn nhất — vì nó được viết từ chính lỗi của bạn, không phải lỗi chung chung trong sách."
        },
        {
          "heading_vi": "Nhịp độ hợp lý: sửa kỹ thắng sửa nhiều",
          "body_vi": "Tự sửa lỗi tốn năng lượng, nên đừng biến mọi phiên học thành phiên soi lỗi — bạn sẽ sợ nói, sợ viết. Nhịp lành mạnh: mỗi tuần 1-2 phiên tự sửa kỹ (một bài nói, một bài viết), các phiên còn lại cứ luyện thoải mái không phán xét. Một bài được ghi âm, đối chiếu và rút ra 3 lỗi đáng giá hơn năm bài nói xong quên luôn. Và hãy giữ lại các bản ghi âm cũ: nghe lại bản của 2 tháng trước là liều thuốc động lực mạnh nhất, vì bạn sẽ NGHE thấy mình tiến bộ."
        }
      ],
      "action_vi": "Vào Luyện kỹ năng → Nghe, lấy 5 câu làm bản mẫu: 🔊 nghe từng câu, ghi âm mình đọc lại bằng nút ⏺ ở tab Nói, nghe đối chiếu và ghi ra 3 lỗi đầu tiên cho checklist cá nhân của bạn."
    }
  ]
};
