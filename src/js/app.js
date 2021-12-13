App = {
  account: '0x0',
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      ethereum.enable();
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      ethereum.enable();
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function() {
    App.contracts.Election.deployed().then(function(instance) {
      return instance.flag();
    }).then(function(flag){
        if(flag){
          App.contracts.Election.deployed().then(function(result) {
          var f1 = $('#form1');
          var f2 = $('#form2');
          var f3 = $('#form3');
          var f4 = $('#form4');
          f1.show();
          f2.hide();
          f3.show();
          f4.hide();
          }).catch(function(err) {
            console.error(err);
          });
        }
        else{
          App.contracts.Election.deployed().then(function(result) {
          var f1 = $('#form1');
          var f2 = $('#form2');
          var f3 = $('#form3');
          var f4 = $('#form4');
          f2.show();
          f1.hide();
          f4.show();
          f3.hide();
          }).catch(function(err) {
            console.error(err);
          });
        }
    });
    var electionInstance;
    var loader = $(".loader");
    var content = $(".content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      console.log(err);
      if (err === null) {
        App.account = account;
        var ad="0xf80140dA97311A4CE480b2fe958774f0C89216c6";
        ad=ad.toLowerCase();
        if(account.localeCompare(ad)==0){
          $('#adm').show();
          $('#vtr').hide();
        }
        else{
          $('#adm').hide();
          $('#vtr').show();
        }
        $("#accountAddress").html("Voter's Address: " + account);
        console.log(App.account);
        console.log(account);
      }
    });

    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidate_count();
    }).then(function(candidate_count) {
      var candidatesResults = $("#candidatesResults0");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidate_count; i++) {
        electionInstance.list_of_candidates(i).then(function(candidate) {
          var v_id = candidate[0];
          var v_name = candidate[2];

          var candidateTemplate = "<tr><th>" + v_id + "</th><td>" + v_name + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          var candidateOption = "<option value='" + v_id + "' >" + v_name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      console.log(App.account);
      return electionInstance.list_of_voters(App.account);
    }).then(function(vot) {
        if(vot) {
          $('#form1').hide();
        }
        loader.hide();
        content.show();
      }).catch(function(error) {  
      console.warn(error);
    });

    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidate_count();
    }).then(function(candidate_count) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for (var i = 1; i <= candidate_count; i++) {
        electionInstance.list_of_candidates(i).then(function(candidate) {
          var o_id = candidate[0];
          var o_name = candidate[2];
          var o_voteCount = candidate[1];

          var candidateTemplate = "<tr><th>" + o_id + "</th><td>" + o_name + "</td><td>"+ o_voteCount+"</td></tr>"
          candidatesResults.append(candidateTemplate);

        });
      }
      console.log(App.account);
      return electionInstance.list_of_voters(App.account);
    }).then(function(vot) {
      if(vot) {
        $('#form1').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {  
      console.warn(error);
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.voteCandidate(candidateId, { from: App.account });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
      document.location.reload(true);
    }).catch(function(err) {
      console.error(err);
    });
  },

  add_candidate: function(){
    var c_name=$('#cn').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.addCandidate(c_name, { from: App.account });
    }).then(function(res){
      document.location.reload(true);
    }).catch(function(err) {
      console.error(err);
    });
  },

  endVoting: function() {
    App.contracts.Election.deployed().then(function(instance) {
      return instance.toggleFlag( { from: App.account });}).then(function(result){
      document.location.reload(true);
    }).catch(function(err) {
      console.error(err);
    });
    
  },

  startVoting: function() {
    App.contracts.Election.deployed().then(function(instance) {
      return instance.toggleFlag( { from: App.account });}).then(function(result){
      document.location.reload(true);
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
